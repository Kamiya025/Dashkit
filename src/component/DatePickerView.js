import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native';
import { Controller } from "react-hook-form";
import DatePicker from 'react-native-neat-date-picker'
import moment from "moment";
import theme from '../theme';



export default DatePickerView = ({ style, control, defaultValue, controlName, errors, label }) => {
    const [openPicker, setOpenPicker] = useState(false);
    const [datePicker, setDatePicker] = useState(defaultValue instanceof Date ? defaultValue : new Date(Date.now()));
    const isError = () => errors instanceof Object;
    return (

        <View style={[style]}>
            <Text style={theme.StyleCommon.label}>{label} <Text style={theme.StyleCommon.textError}>*</Text></Text>
            <Controller
                control={control}
                name={controlName}
                defaultValue={moment(datePicker).format("YYYY-MM-DD")}
                render={({ field: { onChange, value, onBlur } }) => (
                    <View>
                        <TextInput style={isError() ? theme.StyleCommon.formInputError : theme.StyleCommon.formInput}
                            value={value}
                            onPressIn={() => setOpenPicker(true)}
                        />
                        <DatePicker
                            isVisible={openPicker}
                            mode={'single'}
                            onCancel={() => {
                                setOpenPicker(false)
                            }}
                            onConfirm={(date) => {
                                setOpenPicker(false);
                                onChange(date.dateString);
                            }}
                        />
                    </View>
                )}
                rules={{
                    required: {
                        value: true,
                        message: `${label} is require!`
                    }
                }}
            />
            {isError()
                ?
                <Text style={theme.StyleCommon.textError}>
                    {errors.message}</Text> : null}
        </View>

    );
}