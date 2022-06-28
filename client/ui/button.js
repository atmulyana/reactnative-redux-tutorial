import React from 'react';
import {Button, View} from 'react-native';

export default ({title, style, onclick, color, disabled}) => (
    <View style={[{margin: 2}, style]}>
        <Button title={title} onPress={onclick} color={color} disabled={disabled||false} />
    </View>
);