import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    Alert,
    Animated,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    useWindowDimensions,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { isError, useMutation, useQuery } from '@tanstack/react-query';
import RBSheet from 'react-native-raw-bottom-sheet';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useUserDispatch, useUser } from '../../UserContext';
import moment from 'moment';
import theme from '../theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
    baseUrl,
    statusTransitionBackground,
    stringToLinkImg,
    stringToRGB,
} from '../util';
import { useFocusEffect } from '@react-navigation/native';

const Ticket = ({ route, navigation }) => {
    const user = useUser();
    const { ticketId } = route.params;
    const { issueKey } = route.params;
    const { notice } = route.params;
    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        setValue,
        formState: { errors, isValid },
    } = useForm({ mode: 'onBlur' });

    const getUser = useMutation(
        async (data) => {
            let response = await axios({
                method: `get`,
                url: `${baseUrl}/staff/findByUser/${data}`,
                headers: {
                    token: user.accessToken,
                },
            });
            console.log('load user ' + data);
            return response.data;
        },
        {
            onSuccess: (response) => {
                if (!(response instanceof Object && response.name != null))
                    setError('new_assignee', { message: 'Assignee not exist' });
                else {
                    setValue(
                        'new_assignee',
                        `${response.name} [${response.displayName}]`
                    );
                    clearErrors('new_assignee');
                }
            },
        }
    );
    const updateTransferTicket = useMutation(
        async (data) => {
            let issue_id = data.issue_id;
            delete data.issue_id;
            let response = await axios({
                method: `put`,
                url: `${baseUrl}/staff/updateTransferTicket/${issue_id}`,
                headers: {
                    token: user.accessToken,
                },
                data: data,
            });
            console.log('updateTransferTicket ' + issue_id + JSON.stringify(data));
            return response.data;
        },
        {
            onSuccess: (response) => {
                alert('Transfer assignee done');
                detailsTicket.refetch();
            },
            onError: (errors) => {
                alert("Can't update!");
            },
        }
    );

    const updateStatusTransition = useMutation(
        async (data) => {
            let response = await axios({
                method: `put`,
                url: `${baseUrl}/staff/ticket/${detailsTicket.data.issue_id}/transition/`,
                headers: {
                    token: user.accessToken,
                },
                data: {
                    status: data,
                    ticket_id: detailsTicket.data.id,
                    date_activity: detailsTicket.data.activity_date.substring(0, 10),
                    time_spent: detailsTicket.data.time_spent,
                },
            });
            console.log('load user ' + data);
            return response.data;
        },
        {
            onSuccess: (response) => {
                detailsTicket.refetch();
            },
        }
    );
    const detailsTicket = useQuery({
        queryKey: 'detailsTicket',
        queryFn: async () => {
            let response = await axios.get(
                `${baseUrl}/staff/getDetailsTicket/${ticketId}`,
                { headers: { token: user.accessToken } }
            );
            return response.data;
        },
        onSuccess(res) { },
    });

    const [refreshing, setRefreshing] = useState(false);
    const layout = useWindowDimensions();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'detail', title: 'detail' },
        { key: 'log', title: 'logs' },
        { key: 'comments', title: 'comments' },
        // { key: 'history', title: 'History' }
    ]);

    const onRefresh = useCallback(() => {
        detailsTicket.refetch();
        setRefreshing(false);
    }, []);
    useEffect(() => {
        navigation.setOptions({ headerTitle: issueKey });
        Alert.prompt;
    }, []);
    useFocusEffect(
        useCallback(() => {
            detailsTicket.refetch();
        }, [])
    );
    return (
        <SafeAreaView style={theme.StyleCommon.container}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                style={{ flex: 1 }}>
                {detailsTicket.isLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={{}}>
                        {detailsTicket.isSuccess ? (
                            <View style={{ flex: 1 }}>
                                <View style={theme.StyleDashboard.mainContext}>
                                    <Header
                                        data={detailsTicket.data}
                                        getUser={getUser}
                                        updateTransferTicket={updateTransferTicket}
                                        control={control}
                                        handleSubmit={handleSubmit}
                                        errors={errors}
                                        setError={setError}
                                    />
                                </View>
                                <View style={[{ marginTop: 20 }]}>
                                    <TabView
                                        lazy
                                        lazyPreloadDistance={0}
                                        renderTabBar={renderTabBar}
                                        navigationState={{ index, routes }}
                                        renderScene={SceneMap({
                                            detail: () => (
                                                <View>
                                                    <DetailRoute
                                                        data={detailsTicket.data}
                                                        api={updateStatusTransition}
                                                        isFocus={index == 0}
                                                    />
                                                </View>
                                            ),
                                            log: () => (
                                                <LogRoute
                                                    data={detailsTicket.data.detailsLog}
                                                    timeSpent={detailsTicket.data.time_spent}
                                                    ticketId={detailsTicket.data.id}
                                                    navigation={navigation}
                                                    issueKey={issueKey}
                                                    isFocus={index == 1}
                                                />
                                            ),
                                            comments: () => (
                                                <CommentRoute
                                                    data={detailsTicket.data.detailComment}
                                                    timeSpent={detailsTicket.data.time_spent}
                                                    ticketId={detailsTicket.data.id}
                                                    navigation={navigation}
                                                    issueKey={issueKey}
                                                    callback={() => detailsTicket.refetch()}
                                                    isFocus={index == 2}
                                                />
                                            ),
                                        })}
                                        onIndexChange={setIndex}
                                        initialLayout={{ width: layout.width }}
                                    />
                                </View>
                            </View>
                        ) : null}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};
const ShowDetailItem = ({ label, value }) => {
    return (
        <View style={[theme.StyleCommon.flexRow]}>
            <Text
                style={[
                    {
                        flex: 0.35,
                        fontSize: 16,
                        marginVertical: 10,
                        paddingStart: 10,
                        fontWeight: '700',
                    },
                ]}>
                {label}:
            </Text>
            <Text style={{ flex: 0.65, fontSize: 15, marginVertical: 10 }}>
                {value}
            </Text>
        </View>
    );
};

const Header = ({
    data,
    updateTransferTicket,
    getUser,
    setError,
    control,
    handleSubmit,
    errors,
}) => {
    const user = useUser();
    const refRBSheet = useRef();
    const onSubmitTransferAssignee = (d) => {
        if (getUser.data.name == null) {
            setError('new_assignee', { message: 'Assignee not exist' });
            return;
        }
        d.new_assignee = getUser.data.name;
        if (d.note == undefined) data.note = '';
        d.ticket_id = data.id;
        d.time_spent = d.time_spent + 'h';
        d.date_of_activity = data.activity_date.substring(0, 10);
        d.issue_id = data.issue_id;
        updateTransferTicket.mutate(d);
    };

    return (
        <View>
            <View style={{ backgroundColor: '#d0e9f7', borderRadius: 10 }}>
                <View
                    style={[
                        theme.StyleCommon.card,
                        {
                            paddingVertical: 15,
                            paddingHorizontal: 25,
                            minHeight: 180,
                            marginTop: 0,
                            flex: 0.9,
                        },
                    ]}>
                    <View style={{ flex: 0.9 }}>
                        <View style={[theme.StyleCommon.flexRow, { marginVertical: 10 }]}>
                            <Text
                                style={{
                                    flex: 0.5,
                                    alignSelf: 'center',
                                    fontWeight: '700',
                                    letterSpacing: 1,
                                }}>
                                {data.group_name}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row-reverse',
                                    flex: 0.5,
                                }}>
                                <Image
                                    source={{
                                        uri: stringToLinkImg(data.customer_name),
                                    }}
                                    style={[theme.StyleCommon.avataSmall, { marginStart: 10 }]}
                                    resizeMode="center"
                                />
                                <Text style={{ alignSelf: 'center' }}>
                                    {data.customer_name}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontWeight: 'bold', fontSize: 23, paddingStart: 0 }}>
                            {data.summary}
                        </Text>
                    </View>
                    <View style={{ flex: 0.1, flexDirection: 'row', marginTop: 20 }}>
                        <View style={{ flex: 0.5, flexDirection: 'row' }}>
                            <View
                                style={[
                                    theme.StyleCommon.dot,
                                    {
                                        backgroundColor: statusTransitionBackground(
                                            data.status_name
                                        ),
                                    },
                                ]}></View>
                            <Text style={{ fontSize: 10, alignSelf: 'center' }}>
                                {data.status_name}
                            </Text>
                        </View>
                        <View style={theme.StyleCommon.flexRight}>
                            <Text style={{ fontSize: 11 }}>
                                {moment(
                                    data.activity_date.substring(0, 10),
                                    'YYYY-MM-DD'
                                ).format('DD/MM/YYYY')}{' '}
                                -
                                {' ' +
                                    moment(
                                        data.resolved_date.substring(0, 10),
                                        'YYYY-MM-DD'
                                    ).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 0.1 }}>
                    <View style={{ flex: 0.5, alignSelf: 'center', margin: 15 }}>
                        <Text style={{ fontWeight: '500' }}>{data.component_name}</Text>
                    </View>
                    <View style={{ flex: 0.5, flexDirection: 'row-reverse', margin: 3 }}>
                        <TouchableOpacity
                            onPress={() => {
                                refRBSheet.current.open();
                            }}>
                            <View style={[theme.StyleCommon.btnPrimary]}>
                                <Image
                                    source={require('../asset/user_transfer.png')}
                                    style={{ width: 20, height: 20, tintColor: '#fff' }}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text
                            style={{
                                padding: 10,
                                alignSelf: 'center',
                                fontSize: 15,
                                letterSpacing: 1,
                                fontWeight: '800',
                            }}>
                            {data.assignee_name}
                        </Text>
                    </View>
                </View>
            </View>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={650}>
                <ScrollView>
                    <View style={{ margin: 0 }}>
                        <Text
                            style={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'center' }}>
                            Assignee transfer
                        </Text>
                    </View>
                    <View
                        style={[
                            theme.StyleCommon.form,
                            { backgroundColor: '#fff', padding: 20 },
                        ]}>
                        <Text style={theme.StyleCommon.label}>
                            New assignee <Text style={theme.StyleCommon.textError}>*</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="new_assignee"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <View>
                                    <TextInput
                                        style={
                                            errors.new_assignee instanceof Object
                                                ? theme.StyleCommon.formInputError
                                                : theme.StyleCommon.formInput
                                        }
                                        value={value}
                                        clearTextOnFocus={true}
                                        onFocus={() => {
                                            onChange(
                                                getUser.data instanceof Object &&
                                                    getUser.data.name != null
                                                    ? getUser.data.name
                                                    : undefined
                                            );
                                        }}
                                        onBlur={() => getUser.mutate(value)}
                                        onChangeText={(value) => {
                                            onChange(value);
                                        }}
                                    />
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ alignSelf: 'flex-start', flex: 0.9 }}>
                                            {getUser.isLoading ? (
                                                <ActivityIndicator size="large" />
                                            ) : null}
                                            {errors.new_assignee instanceof Object ? (
                                                <Text style={theme.StyleCommon.textError}>
                                                    {errors.new_assignee.message}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                getUser.mutate(user.name);
                                                onChange(user.name);
                                            }}>
                                            <Text style={theme.StyleCommon.btnAsLink}>
                                                Assignee me
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'New assignee is require!',
                                },
                            }}
                        />
                        <Text style={theme.StyleCommon.label}>Note</Text>
                        <Controller
                            control={control}
                            name="note"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <View>
                                    <TextInput
                                        style={theme.StyleCommon.formInput}
                                        value={value}
                                        onChangeText={(value) => {
                                            onChange(value);
                                        }}
                                    />
                                </View>
                            )}
                        />

                        {updateTransferTicket.isLoading ? (
                            <ActivityIndicator size="large" />
                        ) : null}
                        <Text style={theme.StyleCommon.label}>
                            Time spent <Text style={theme.StyleCommon.textError}>*</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="time_spent"
                            defaultValue={(parseInt(data.time_spent)).toString()}
                            render={({ field: { onChange, value, onBlur } }) => (
                                <TextInput
                                    style={
                                        errors.time_spent instanceof Object
                                            ? theme.StyleCommon.formInputError
                                            : theme.StyleCommon.formInput
                                    }
                                    value={value}
                                    keyboardType="phone-pad"
                                    onChangeText={(value) => onChange(value)}
                                />
                            )}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Time spent is require!',
                                },
                                pattern: {
                                    value: /[0-9]/,
                                    message: 'Format: [0-9]',
                                },
                            }}
                        />

                        {updateTransferTicket.isLoading ? (
                            <ActivityIndicator size="large" />
                        ) : null}

                        <View style={{ flexDirection: 'row-reverse', padding: 10 }}>
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmitTransferAssignee)}>
                                <View style={theme.StyleCommon.btnPrimary}>
                                    <Text style={theme.StyleCommon.btnPrimaryText}>Update</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    refRBSheet.current.close();
                                }}>
                                <View style={{}}>
                                    <Text style={theme.StyleCommon.btnAsLink}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </RBSheet>
        </View>
    );
};
const DetailRoute = ({ data, api, isFocus }) => {
    const [descriptionShownMore, setDescriptionShowMore] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);
    const onTextLayout = useCallback((e) => {
        setLengthMore(e.nativeEvent.lines.length >= 5);
    }, []);
    const toggleNumberOfLines = () => {
        setDescriptionShowMore(!descriptionShownMore);
    };
    return (
        <View style={theme.StyleCommon.mainContext}>
            <View style={{ marginTop: 10 }}>
                <ShowDetailItem label={'Project'} value={data.project_name} />

                <ShowDetailItem label={'Priority'} value={data.name_priority} />

                <ShowDetailItem label={'Request'} value={data.request_name} />

                <ShowDetailItem label={'Sizing'} value={data.sizing_name} />
                <View style={[theme.StyleCommon.flexRow]}>
                    <Text
                        style={[
                            {
                                flex: 0.35,
                                fontSize: 16,
                                marginVertical: 10,
                                paddingStart: 10,
                                fontWeight: '700',
                            },
                        ]}>
                        Description:
                    </Text>

                    <View style={{ flex: 0.65, fontSize: 15, marginVertical: 10 }}>
                        <Text
                            style={{}}
                            onTextLayout={onTextLayout}
                            numberOfLines={descriptionShownMore ? undefined : 5}
                            ellipsizeMode="clip">
                            {data.description_by_staff}{' '}
                        </Text>
                        {lengthMore ? (
                            <Text
                                onPress={toggleNumberOfLines}
                                style={{ textDecorationLine: 'underline', color: '#2c7be5' }}>
                                {descriptionShownMore ? 'Read less...' : 'Read more...'}
                            </Text>
                        ) : null}
                    </View>
                </View>

                <ShowDetailItem label={'Time spent'} value={data.time_spent} />

                <ShowDetailItem
                    label={'Scope'}
                    value={data.scope.data == 1 ? 'true' : 'false'}
                />
            </View>
            <View
                style={{
                    flexDirection: 'row-reverse',
                }}>
                {data.statusTransition.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                            api.mutate(item.id);
                        }}>
                        <View
                            style={[
                                theme.StyleCommon.btn,
                                {
                                    marginVertical: 15,
                                    marginHorizontal: 10,
                                    backgroundColor: statusTransitionBackground(item.name),
                                },
                            ]}>
                            <Text
                                style={[theme.StyleCommon.btnPrimaryText, { fontSize: 15 }]}>
                                {item.name.toUpperCase()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
const Paging = ({ length, size, curpage, action }) => {
    let pages = Math.ceil(length / size);
    let arrList = Array.from({ length: pages }, (_, i) => i + 1);

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 10,
            }}>
            {curpage == 1 ? null : (
                <TouchableOpacity
                    onPress={() =>
                        action((curpage - 2) * size, (curpage - 1) * size, curpage - 1)
                    }>
                    <View
                        key={'next'}
                        style={[theme.StyleCommon.btnPage, { backgroundColor: '#c0c0c0' }]}>
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{ paddingTop: 20, paddingStart: 20 }}
                            color={'#fff'}
                        />
                    </View>
                </TouchableOpacity>
            )}
            {arrList.map((item, index) => (
                <TouchableOpacity
                    key={item}
                    onPress={() => action(index * size, item * size, item)}>
                    <Text
                        style={[
                            {
                                backgroundColor: item == curpage ? '#2c7be5' : '#c0c0c0',
                            },
                            theme.StyleCommon.btnPage,
                        ]}>
                        {item}
                    </Text>
                </TouchableOpacity>
            ))}
            {curpage >= pages ? null : (
                <TouchableOpacity
                    onPress={() =>
                        action(curpage * size, (curpage + 1) * size, curpage + 1)
                    }>
                    <View
                        key={'next'}
                        style={[theme.StyleCommon.btnPage, { backgroundColor: '#c0c0c0' }]}>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            style={{ paddingTop: 20, paddingStart: 20 }}
                            color={'#fff'}
                        />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};
const LogRoute = ({
    data,
    timeSpent,
    ticketId,
    issueKey,
    navigation,
    isFocus,
}) => {
    const [maxItemShow, setMaxItemShow] = useState(5);
    const [startItemShow, setStartItemShow] = useState(0);
    const [curpage, setCurpage] = useState(1);
    return (
        <View style={theme.StyleCommon.mainContext}>
            <View style={theme.StyleDashboard.header}>
                <View style={{ alignItems: 'flex-start', flex: 0.5 }}>
                    <Text
                        style={[
                            theme.StyleDashboard.headerPretitle,
                            theme.StyleCommon.alignSelfCenter,
                        ]}>
                        progress
                    </Text>
                    <Text
                        style={[
                            theme.StyleDashboard.headerTitle,
                            theme.StyleCommon.alignSelfCenter,
                        ]}>
                        {(
                            (data
                                .map((i) => parseInt(i.time_spent))
                                .reduce((a, b) => a + b, 0) /
                                parseInt(timeSpent)) *
                            100
                        ).toFixed(0)}
                        %
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end', flex: 0.5 }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('AddLog', {
                                ticketId: ticketId,
                                issueKey: issueKey,
                            });
                        }}>
                        <View style={theme.StyleCommon.btnPrimary}>
                            <Text style={theme.StyleCommon.btnPrimaryText}>Add log</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                {!isFocus
                    ? undefined
                    : data.slice(startItemShow, maxItemShow).map((item, index) => (
                        <View
                            key={item.id}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderBottomColor: '#95aacb',
                                borderBottomWidth: 1,
                                borderRadius: 10,
                                borderEndColor: item.ot.data[0] == 1 ? '#dd0000' : '#008000',
                                borderEndWidth: 10,
                                marginBottom: 2,
                            }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ fontSize: 17, marginBottom: 5 }}>
                                    {item.comment}
                                </Text>
                                <Text style={{ fontSize: 14 }}>
                                    <Text>({item.time_spent} hour</Text>
                                    <Text>
                                        {' '}
                                        - Start:{' '}
                                        {moment(item.start_date, 'DD-MM-YYYY').format(
                                            'DD/MM/YYYY'
                                        )}
                                        )
                                    </Text>
                                </Text>
                            </View>
                            <View style={theme.StyleCommon.flexRow}>
                                <Text style={{ flex: 0.5, fontSize: 13, fontWeight: 'bold' }}>
                                    {item.phase_work_log_name}
                                </Text>
                                <View
                                    style={[theme.StyleCommon.flexRowReverse, { flex: 0.5 }]}>
                                    <Text
                                        style={[
                                            theme.StyleCommon.alignSelfCenter,
                                            { fontSize: 12 },
                                        ]}>
                                        {moment(
                                            item.date_created.substring(0, 19),
                                            'YYYY-MM-DDTHH:mm:ss'
                                        ).fromNow()}
                                    </Text>
                                    <View
                                        style={[
                                            theme.StyleCommon.dotSmall,
                                            { backgroundColor: '#95aac9' },
                                        ]}></View>
                                    <Text
                                        style={[
                                            theme.StyleCommon.alignSelfCenter,
                                            { fontSize: 12 },
                                        ]}>
                                        {item.type_of_work}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
            </View>
            <Paging
                length={data.length}
                size={5}
                curpage={curpage}
                action={(start, end, curpage) => {
                    setStartItemShow(start);
                    setMaxItemShow(end);
                    setCurpage(curpage);
                }}
            />
        </View>
    );
};

const CommentRoute = ({ data, ticketId, issueKey, callback, isFocus }) => {
    const user = useUser();
    const [maxItemShow, setMaxItemShow] = useState(5);
    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors, isValid },
    } = useForm({ mode: 'onChange' });
    const addCmt = useMutation(async (data) => {
        let response = await axios({
            method: `post`,
            url: `${baseUrl}/staff/addComment/${issueKey}`,
            headers: {
                token: user.accessToken,
            },
            data: data,
        });

        return response.data;
    });
    const onSubmit = (data) => {
        data.ticket_id = ticketId;
        console.log('create comment data ' + JSON.stringify(data));
        addCmt.mutate(data);
        reset();
    };
    const isYou = (accountCreated) => user.name === accountCreated;
    useEffect(() => {
        if (addCmt.isSuccess) {
            callback();
        }
    }, [addCmt]);
    return (
        <View style={theme.StyleCommon.mainContext}>
            <View style={{ marginVertical: 30, flexDirection: 'row' }}>
                <View style={{ flex: 0.8 }}>
                    <Controller
                        control={control}
                        name="content"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <TextInput
                                style={theme.StyleCommon.formInputBorderBottom}
                                value={value}
                                placeholder={'Content'}
                                onChangeText={(value) => {
                                    onChange(value);
                                }}
                            />
                        )}
                        rules={{
                            required: {
                                value: true,
                                message: 'Content is require!',
                            },
                        }}
                    />
                </View>
                <View style={{ alignItems: 'flex-end', flex: 0.2 }}>
                    <TouchableOpacity
                        disabled={
                            !(getValues('content') != '' && getValues('content') != undefined)
                        }
                        onPress={handleSubmit(onSubmit)}>
                        <View
                            style={
                                getValues('content') != '' && getValues('content') != undefined
                                    ? theme.StyleCommon.btnPrimary
                                    : theme.StyleCommon.btnDisabled
                            }>
                            <View style={{ margin: 5 }}>
                                <FontAwesomeIcon icon={faComment} color="#fff" size={20} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {!isFocus ? undefined : (
                <View>
                    {data.slice(0, maxItemShow).map((item, index) => (
                        <View
                            key={item.id}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 0,
                                marginBottom: 10,
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: isYou(item.created_by_account)
                                        ? 'row-reverse'
                                        : 'row',
                                }}>
                                <View>
                                    <View
                                        style={{
                                            flexDirection: isYou(item.created_by_account)
                                                ? 'row-reverse'
                                                : 'row',
                                        }}>
                                        <Text>{item.created_by_account}</Text>
                                        <Text>{'\t'}</Text>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                marginStart: 5,
                                                alignSelf: 'flex-end',
                                            }}>
                                            {moment(
                                                item.date_created,
                                                'YYYY-MM-DDTHH:mm:ss'
                                            ).fromNow()}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            theme.StyleCommon.flexRow,
                                            {
                                                alignSelf: isYou(item.created_by_account)
                                                    ? 'flex-end'
                                                    : 'flex-start',
                                            },
                                        ]}>
                                        <Text
                                            style={[
                                                {
                                                    fontSize: 17,
                                                    marginVertical: 5,
                                                    padding: 8,
                                                    borderRadius: 16,
                                                    backgroundColor: isYou(item.created_by_account)
                                                        ? '#d0e9f7'
                                                        : '#bfccdf',
                                                },
                                                isYou(item.created_by_account)
                                                    ? { borderBottomRightRadius: 0 }
                                                    : { borderBottomLeftRadius: 0 },
                                            ]}>
                                            {item.content}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}

                    {maxItemShow < data.length ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{ flex: 1, height: 1, backgroundColor: '#808080' }}
                            />
                            <TouchableOpacity
                                style={{}}
                                onPress={() => setMaxItemShow(maxItemShow + 5)}>
                                <Text style={{ width: 70, textAlign: 'center' }}>
                                    {'Show more'}
                                </Text>
                            </TouchableOpacity>
                            <View
                                style={{ flex: 1, height: 1, backgroundColor: '#808080' }}
                            />
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View
                                style={{ flex: 1, height: 1, backgroundColor: '#808080' }}
                            />
                            <View>
                                <Text style={{ width: 50, textAlign: 'center' }}>Start</Text>
                            </View>
                            <View
                                style={{ flex: 1, height: 1, backgroundColor: '#808080' }}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const renderTabBar = (props) => (
    <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: '#2c7be5' }}
        style={{
            backgroundColor: '#f9fbfd',
            borderBottomWidth: 1,
            borderBottomColor: '#95aacb',
            marginHorizontal: 20,
            elevation: 0,
        }}
        activeColor={'#2c7be5'}
        inactiveColor={'#95aacb'}
    />
);

export default Ticket;