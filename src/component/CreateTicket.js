import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    Button,
    Switch,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useForm, Controller } from "react-hook-form";
import axios, { AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUserDispatch, useUser } from "../../UserContext";
import moment from "moment";
import theme from '../theme';
import { baseUrl } from '../util';
import SelectOfList from './SelectOfList';
import DatePickerView from './DatePickerView';

const happinesss = '../asset/logo.png';

const InputTextForm = ({ label, control, controlName, errors }) => {
    const isError = () => errors instanceof Object && errors.message != null;
    return (
        <View>
            <Text style={theme.StyleCommon.label}>{label} <Text style={theme.StyleCommon.textError}>*</Text></Text>
            <Controller
                control={control}
                name={controlName}
                render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                        style={isError() ? theme.StyleCommon.formInputError : theme.StyleCommon.formInput}
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
                    {errors.message}</Text> : null}</View>);

}

function CreateTicket({ navigation }) {
    const user = useUser();
    const { control, handleSubmit, setError, setValue, clearErrors, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
    const configTicket = useQuery({
        queryKey: 'configTicket',
        queryFn: async () => {
            let response = await axios.get(`${baseUrl}/staff/getConfigTicket/`,
                { headers: { token: user.accessToken } });
            return response.data;
        }
    });
    const listComponent = useMutation(async data => {
        let response = await axios(
            {
                method: `get`,
                url: `${baseUrl}/staff/project/${data}/component`,
                headers:
                {
                    token: user.accessToken
                }
            });
        console.log('project id' + data)
        return response.data.component_name;

    });
    const getUser = useMutation(async data => {
        let response = await axios(
            {
                method: `get`,
                url: `${baseUrl}/staff/findByUser/${data}`,
                headers:
                {
                    token: user.accessToken
                },

            });
        console.log('load user ' + data);
        return response.data;

    }, {
        onSuccess: response => {
            if (!(response instanceof Object && response.name != null))
                setError('assignee_name', { message: "Assignee not exist" });
            else {
                setValue('assignee_name', `${response.name} [${response.displayName}]`)
                clearErrors('assignee_name');
            }
        }
    });
    const createTicketByStaff = useMutation(async data => {

        let response = await axios(
            {
                method: `post`,
                url: `${baseUrl}/staff/createTicketByStaff`,
                headers:
                {
                    token: user.accessToken
                },
                data: data

            });

        return response.data;

    }, {
        onSuccess: response => {
            console.log('data new ticket:' + JSON.stringify(response));
            navigation.navigate('Ticket', { ticketId: response.idMaster })
        }
    });
    const [projectSelected, setProjectSelected] = useState();

    useEffect(() => {
        if (projectSelected != null) listComponent.mutate(projectSelected.project_id)
    }, [projectSelected]);
    const onSubmit = data => {
        delete data.status;
        if (getUser.data.name == null) {
            setError('new_assignee', { message: "Assignee not exist" });
            return;
        }
        data.time_spent = data.time_spent + 'h';
        data.assignee_name = getUser.data.name;
        console.log('create ticket data ' + JSON.stringify(data));
        createTicketByStaff.mutate(data);
    };
    return (

        <SafeAreaView style={theme.StyleCommon.container}>

            <ScrollView
                contentInsetAdjustmentBehavior="automatic">
                {configTicket.isLoading ? <ActivityIndicator size="large" /> :
                    <View style={theme.StyleDashboard.mainContext}>

                        <View style={theme.StyleCommon.form}>
                            <InputTextForm
                                label={'Customer Name'}
                                control={control}
                                controlName={'customer_name'}
                                errors={errors.customer_name} />
                            <SelectOfList
                                label={'Project'}
                                data={configTicket.data.projects}
                                disabledBtn={false}
                                onSelect={(item) => { setProjectSelected(item) }}
                                onSelectedItem={(select) => select.name}
                                textSelectedShow={(item) => item.name}
                                control={control}
                                controlName={'project_id'}
                                onChangeValue={(item) => item.project_id}
                                errors={errors.project}
                            />
                            <SelectOfList
                                label={'Component'}
                                data={listComponent.data}
                                disabledBtn={(projectSelected == null || listComponent.isError)}
                                onSelectedItem={(select) => select.name}
                                textSelectedShow={(item) => item.name}
                                control={control}
                                controlName={'component_name'}
                                onChangeValue={(item) => item.name}
                                errors={errors.component_name}
                            />
                            <InputTextForm
                                label={'Summary'}
                                control={control}
                                controlName={'summary'}
                                errors={errors.summary} />

                            <View style={{ flexDirection: 'row' }}>
                                <DatePickerView
                                    style={{ flex: 0.5, marginEnd: 5 }}
                                    isEnabled={true}
                                    control={control}
                                    controlName={'activity_date'}
                                    label={'Activity Date'}
                                    errors={errors.activity_date} />
                                <DatePickerView
                                    style={{ flex: 0.5, marginStart: 5 }}
                                    isEnabled={true}
                                    control={control}
                                    controlName={'resolved_date'}
                                    label={'Resolved Date'}
                                    errors={errors.resolved_date} />
                            </View>

                            <Text style={theme.StyleCommon.label}>Assignee <Text style={theme.StyleCommon.textError}>*</Text></Text>
                            <Controller
                                control={control}
                                name="assignee_name"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <View>
                                        <TextInput
                                            style={(errors.assignee_name instanceof Object) ? theme.StyleCommon.formInputError : theme.StyleCommon.formInput}
                                            value={value}
                                            onFocus={() => { onChange((getUser.data instanceof Object && getUser.data.name != null) ? getUser.data.name : undefined) }}
                                            onBlur={() => getUser.mutate(value)}
                                            onChangeText={value => {
                                                onChange(value);
                                            }}
                                        />

                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ alignSelf: 'flex-start', flex: 0.9 }}>
                                                {getUser.isLoading ?
                                                    <ActivityIndicator size="large" /> : null}
                                                {(errors.assignee_name instanceof Object)
                                                    ?
                                                    <Text style={theme.StyleCommon.textError}>
                                                        {errors.assignee_name.message}</Text> : null}
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => { getUser.mutate(user.name); onChange(user.name) }}>
                                                <Text style={{ color: '#2c7be5', alignSelf: 'flex-end', marginVertical: 10, flex: 0.1 }}>Assignee me</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                )}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Assignee is require!'
                                    },

                                }}
                            />




                            <SelectOfList
                                label={'Group'}
                                data={configTicket.data.group}
                                disabledBtn={false}
                                onSelectedItem={(select) => select.group_name}
                                textSelectedShow={(item) => item.group_name}
                                control={control}
                                controlName={'group_id'}
                                onChangeValue={(item) => item.id}
                                errors={errors.group_id}
                            />

                            <SelectOfList
                                label={'Status'}
                                data={configTicket.data.status}
                                disabledBtn={true}
                                putDefaultValue={configTicket.data.status[0]}
                                putDefaultControl={configTicket.data.status[0].status_name}
                                onSelectedItem={(select) => select.status_name}
                                textSelectedShow={(item) => item.status_name}
                                control={control}
                                controlName={'status'}
                                onChangeValue={(item) => item.id}
                                errors={errors.status}
                            />
                            <SelectOfList
                                label={'Priority'}
                                data={configTicket.data.priority}
                                disabledBtn={false}
                                onSelectedItem={(select) => select.name_priority}
                                textSelectedShow={(item) => item.name_priority}
                                control={control}
                                controlName={'priority_id'}
                                onChangeValue={(item) => item.id}
                                errors={errors.priority_id}
                            />

                            <SelectOfList
                                label={'Request'}
                                data={configTicket.data.request}
                                disabledBtn={false}
                                onSelectedItem={(select) => select.request_type_name}
                                textSelectedShow={(item) => item.request_type_name}
                                control={control}
                                controlName={'request_type_id'}
                                onChangeValue={(item) => item.id}
                                errors={errors.request_type_id}
                            />
                            <SelectOfList
                                label={'Sizing'}
                                data={configTicket.data.sizing}
                                disabledBtn={false}
                                onSelectedItem={(select) => select.name}
                                textSelectedShow={(item) => item.name}
                                control={control}
                                controlName={'sizing_id'}
                                onChangeValue={(item) => item.id}
                                errors={errors.sizing_id}
                            />


                            <Text style={theme.StyleCommon.label}>Description <Text style={theme.StyleCommon.textError}>*</Text></Text>
                            <Controller
                                control={control}
                                name="description_by_staff"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <TextInput
                                        style={theme.StyleCommon.formAreaInput}
                                        numberOfLines={10}
                                        multiline={true}
                                        value={value}
                                        onChangeText={value => onChange(value)}
                                    />)}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Description is require!'
                                    }
                                }}
                            />

                            {(errors.description instanceof Object)
                                ?
                                <Text style={theme.StyleCommon.textError}>
                                    {errors.description.message}</Text> : null}

                            <Text style={theme.StyleCommon.label}>Time spent <Text style={theme.StyleCommon.textError}>*</Text></Text>
                            <Controller
                                control={control}
                                name="time_spent"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <TextInput
                                        style={(errors.time_spent instanceof Object) ? theme.StyleCommon.formInputError : theme.StyleCommon.formInput}
                                        value={value}
                                        keyboardType="phone-pad"
                                        onChangeText={value => onChange(value)}
                                    />)}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Time spent is require!'
                                    }
                                    , pattern: {
                                        value: /[0-9]/,
                                        message: 'Format: [0-9]'
                                    }
                                }
                                }
                            />
                            {(errors.time_spent instanceof Object)
                                ?
                                <Text style={theme.StyleCommon.textError}>
                                    {errors.time_spent.message}</Text> : null}
                            <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                                <Controller
                                    control={control}
                                    name="scope"
                                    defaultValue={1}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Switch
                                            trackColor={{ false: "#e3ebf6", true: "#2c7be5" }}
                                            thumbColor={value === 1 ? "#fff" : "#f4f3f4"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={() => onChange(value == 1 ? 0 : 1)}
                                            value={value === 1}
                                        />)} />
                                <Text style={{
                                    alignSelf: 'center',
                                    fontWeight: '500',
                                    fontSize: 18,
                                    marginStart: 10
                                }}>
                                    Scope
                                </Text>

                            </View>

                            {
                                createTicketByStaff.isError ?
                                    <Text style={theme.StyleCommon.textError}>
                                        {JSON.stringify(createTicketByStaff.error.response.data.error.createTicket.error)}
                                    </Text>
                                    : null
                            }
                            <TouchableOpacity
                                disabled={createTicketByStaff.status != 'idle'}
                                onPress={handleSubmit(onSubmit)}>
                                <View
                                    style={createTicketByStaff.isLoading ? theme.StyleCommon.btnDisabled : theme.StyleCommon.btnSubmit}>
                                    {
                                        createTicketByStaff.isLoading ?
                                            <ActivityIndicator size="large" color={'#fff'} /> :
                                            <Text style={theme.StyleCommon.btnPrimaryText}>Create ticket</Text>
                                    }
                                </View>
                            </TouchableOpacity>


                        </View>
                    </View>
                }


            </ScrollView>
        </SafeAreaView >

    );
}

export default CreateTicket;
