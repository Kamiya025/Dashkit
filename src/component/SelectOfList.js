import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
} from 'react-native';
import { Controller } from "react-hook-form";
import theme from '../theme';
import Select from 'react-native-select-dropdown'
const happinesss = '../asset/logo.png';


const SelectOfList = ({ label, sublable = '', data, disabledBtn,
    putDefaultValue, onSelect, onSelectedItem,
    textSelectedShow,
    control, controlName, putDefaultControl,
    onChangeValue, errors }) => {
    const isError = () => errors instanceof Object;
    return (
        <View>
            <Text style={theme.StyleCommon.label}>{label}
                <Text style={theme.StyleCommon.textError}>*</Text>
                <Text>{sublable}</Text>
            </Text>

            <Controller
                control={control}
                name={controlName}
                defaultValue={putDefaultControl}
                render={({ field: { onChange, value, onBlur } }) => (
                    <Select
                        defaultButtonText={`Select a ${label}`}
                        disabled={disabledBtn}
                        defaultValue={putDefaultValue != null ? putDefaultValue : null}
                        data={data}
                        onSelect={(selectedItem) => {
                            if (onSelect instanceof Function) onSelect(selectedItem)
                            onChange(onChangeValue(selectedItem))
                        }}
                        dropdownOverlayColor={'#0074cc00'}
                        dropdownIconPosition={'left'}
                        buttonTextAfterSelection={(selectedItem) => onSelectedItem(selectedItem)}
                        buttonTextStyle={(disabledBtn) ? theme.StyleCommon.textSelectDisabled : theme.StyleCommon.textSelect}
                        rowTextForSelection={(item) => textSelectedShow(item)}
                        buttonStyle={isError() ? theme.StyleCreateTicket.buttonErrorStyle : theme.StyleCreateTicket.buttonStyle}
                        searchInputStyle={theme.StyleCreateTicket.searchInputStyle}
                        dropdownStyle={theme.StyleCreateTicket.dropdownStyle}
                        rowStyle={{ backgroundColor: "#fff", borderBottomColor: "#fff" }}
                        rowTextStyle={{ textAlign: 'left', color: '#6e84a3' }}
                        selectedRowTextStyle={{ textAlign: 'left' }}
                        selectedRowStyle={theme.StyleCreateTicket.selectedRowStyle}
                    />)}
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

export default SelectOfList;   