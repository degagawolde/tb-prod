from tensorflow.keras.layers import Input, Conv2D, BatchNormalization, Dense, Add, UpSampling2D
from tensorflow.keras.layers import AvgPool2D, GlobalAveragePooling2D, MaxPool2D, Activation
from tensorflow.keras.layers import ReLU, concatenate, Layer,Concatenate
from tensorflow.keras.activations import sigmoid, softmax
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import Model
import tensorflow.keras.backend as K
import tensorflow as tf


class ConvexCombination(Layer):
    def __init__(self, **kwargs):
        super(ConvexCombination, self).__init__(**kwargs)

    def build(self, input_shape):
        self.lambd = self.add_weight(name='lambda',
                                     shape=(3, 1),  # Adding one dimension for broadcasting
                                     initializer=tf.keras.initializers.Constant(1/3),  # Try also 'ones' and 'uniform'
                                     trainable=True)
        super(ConvexCombination, self).build(input_shape)

    def call(self, x):
        h0, h1, h2 = x
        return self.lambd[0] * h0 + self.lambd[1] * h1 +  self.lambd[2] * h2 

    def compute_output_shape(self, input_shape):
        return input_shape[0]

class GetPrediction:
    def __init__(self, filters=32, cam_w=100,cam_sigma=0.4, cam_loss_sigma=0.75, lse_r=6, target_size=(512,512)) -> None:
        self.filters = filters
        self.cam_w = cam_w
        self.cam_sigma = cam_loss_sigma
        self.cam_loss_sigma = cam_loss_sigma
        self.lse_r = lse_r
        self.target_size = target_size
        self.IM_WIDTH = target_size[0]
        self.IM_HEIGHT = target_size[1] 

        #batch norm + relu + conv
     #batch norm + relu + conv
    def bn_rl_conv(self,x,filters, block, kernel=1,strides=1):
        x = tf.keras.activations.tanh(x)
        x = BatchNormalization(name="BN-"+block)(x)
        x = Conv2D(filters, kernel, strides=strides,padding = 'same', name="conv-"+block)(x)
        return x
    
    def dense_block(self, x, repetition):
        for i in range(repetition):
            y = self.bn_rl_conv(x, 4*self.filters,str(repetition)+"-1-"+str(i))
            y = self.bn_rl_conv(y, self.filters, str(repetition)+"-2-"+str(i), kernel=3)
            x = Concatenate()([y,x])
        return x
        
    def transition_layer(self,x,block,pooling=True):
        x = self.bn_rl_conv(x, K.int_shape(x)[-1] //2, block)
        if pooling:
            x = AvgPool2D(2, strides = 2, padding = 'same', name='avgp_'+str(block))(x)
        return x
    
    def cam_learner(self,x, gap):
        B, H, W, C = x.shape
        y = Conv2D(C, 3, activation = 'tanh', padding='same')(x)
        y = tf.keras.layers.Multiply()([y, gap])
        y = BatchNormalization(axis=-1)(y)
        y = tf.reduce_sum(y, axis=-1, keepdims=True)
        y = tf.image.resize(y, size=self.target_size, method="bilinear")

        return y
        
    def densenet(self, input_shape, n_classes):
    
        input = Input(input_shape)
        x = Conv2D(64, 7, strides = 2, padding = 'same')(input)
        x = MaxPool2D(3, strides = 2, padding = 'same')(x)
        
        b_0 = self.dense_block(x, 3)
        b_0 = self.transition_layer(b_0,'tran-'+str(6))
        
        b_1 =  self.dense_block(b_0, 6)
        b_1 = self.transition_layer(b_1,'tran-'+str(12))
        gap1 = GlobalAveragePooling2D(name="gap1")(b_1)
        dense1 = Dense(32, name="dense1")(gap1)
        cam1 = self.cam_learner(b_1, gap1)

        b_2 =  self.dense_block(b_1, 12)
        b_2= self.transition_layer(b_2,'tran-'+str(24)) 
        gap2 = GlobalAveragePooling2D(name="gap2")(b_2)
        dense2 = Dense(32, name="dense2")(gap2)
        cam2 = self.cam_learner(b_2, gap2)
        
        b_3 =  self.dense_block(b_2, 8)
        b_3 = self.transition_layer(b_3,'tran-'+str(16))
        gap3 = GlobalAveragePooling2D(name="gap3")(b_3)
        dense3 = Dense(32, name="dense3")(gap3)
        cam3 = self.cam_learner(b_3, gap3)
        
        cls_out = Add()([dense1,dense2,dense3])
        cls_out = Dense(n_classes, activation = 'softmax', name="dense_out")(cls_out)

        cam = Add()([cam1,cam2,cam3])
        cam = Conv2D(1, 1, activation = 'sigmoid', padding='same', name='wss')(cam)

        model = Model(input,  [cls_out, cam])
        return model

    def build_model(self):
        # import os
        # os.environ["CUDA_VISIBLE_DEVICES"]="0"
        # tf_device='/gpu:0'
        smooth = 1e-15
        def jackard_index(y_true, y_pred):
            y_true = K.flatten(y_true)
            y_pred = K.flatten(y_pred)
            intersection = tf.reduce_sum(y_true * y_pred)
            return (intersection + smooth) / (tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) -intersection + smooth)

        def amse_loss(y_true, y_pred):
            if tf.reduce_sum(y_true) > 0:
                num =  tf.reduce_sum(tf.math.square(y_true - y_pred))
                denom = tf.reduce_sum(y_true) + tf.reduce_sum(y_pred)
                return num/denom
            else:
                return tf.constant(0.0)
        
        input_shape = self.IM_HEIGHT, self.IM_WIDTH, 3
        n_classes = 3
        model = self.densenet(input_shape,n_classes)
        lr=0.0001
        model.compile(
            loss=['categorical_crossentropy', amse_loss],
            loss_weights = [1, 0.5],
            optimizer=Adam(learning_rate=lr), 
            metrics=['accuracy', jackard_index, tf.keras.metrics.AUC()])
        
        return model
    
    def load_model(self,weight_path):
        model = self.build_model()
        model.load_weights(weight_path)
        return model
