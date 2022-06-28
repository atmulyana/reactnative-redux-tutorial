import React from 'react';
import {View} from 'react-native';
import {SafeAreaInsetsContext, SafeAreaProvider} from 'react-native-safe-area-context';

export default props => <SafeAreaProvider><SafeAreaInsetsContext.Consumer>{insets =>
    <View style={[props.style, {position: 'absolute'}, insets]}>
        {props.children}
    </View>
}</SafeAreaInsetsContext.Consumer></SafeAreaProvider>;