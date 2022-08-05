import React from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native';

import { Controller } from "react-hook-form";
import theme from '../theme';


export default InputTextForm = ({ label, control, controlName, errors }) => {

    const isError = () => errors instanceof Object && errors.message != null;

    return (
        <View>
            <Text style={theme.StyleCommon.label}>{label}</Text>
            <Controller
                control={control}
                name={controlName}
                render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                        style={theme.StyleCommon.formInput}
                        value={value}
                        onChangeText={value => onChange(value)}
                    />)}
                rules={{
                    required: {
                        value: true,
                        message: `${label} is require!`
                    }
                }}
            />
            {(isError()) ?
                <Text style={theme.StyleCommon.textError}>
                    {errors.message}</Text> : null}
        </View>
    );

}
