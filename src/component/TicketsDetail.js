import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    RefreshControl
} from 'react-native';
import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useUser } from "../../UserContext";
import moment from 'moment';
import theme from '../theme'
import { baseUrl, stringToLinkImg, stringToRGB } from '../util';
import { Card } from './Card';
import { floor } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

function TicketsDetail({ route, navigation }) {
    const user = useUser();
    const { ticketsType } = route.params;
    const [dataOfTable, setDataOfTable] = useState({
        tableHead: ['Key', 'Customer', 'Summary', 'Description', 'Request type'],
        tableData: []
    });


    const ticketStatusAllByStaff = useQuery({
        queryKey: 'ticket',
        queryFn: async () => {
            let response = await axios.get(`${baseUrl}/staff/ticketStatusAllByStaff/`,
                { headers: { token: user.accessToken } });
            return (response.data.tickets.find(item => item.type == ticketsType)).details;
        }
    });


    useEffect(() => navigation.setOptions({ headerTitle: ticketsType }), [])
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        ticketStatusAllByStaff.refetch().then(() => setRefreshing(false));

    }, []);


    return (


        <SafeAreaView style={theme.StyleCommon.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <View style={theme.StyleDashboard.mainContext}>

                    {ticketStatusAllByStaff.isSuccess ? ticketStatusAllByStaff.data.map((item, index) =>
                        <TouchableOpacity
                            key={index}
                            style={theme.StyleCommon.card}
                            onPress={() => { navigation.navigate('Ticket', { ticketId: item.id,issueKey:item.issue_key }) }}>
                            <View style={{ paddingVertical: 15, paddingHorizontal: 25, height: 200 }}>
                                <View style={{ flex: 0.9 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 17, paddingStart: 0 }}
                                        numberOfLines={1}
                                        ellipsizeMode='tail'>
                                        {item.issue_key}
                                    </Text>
                                    <View style={{
                                        flexDirection: 'row', paddingTop: 5, marginStart: -3
                                    }}>
                                        <Image
                                            source={{
                                                uri: stringToLinkImg(item.customer_name)
                                            }}
                                            style={[theme.StyleCommon.avataSmall, { marginRight: 10 }]}
                                            resizeMode='center'
                                        />
                                        <Text style={{ alignSelf: 'center' }}>
                                            {item.customer_name}
                                        </Text>
                                    </View>
                                    <View
                                        style={{ paddingTop: 10, paddingBottom: 20 }}>
                                        <Text
                                            style={{ height: 65, fontSize: 15, marginStart: 3, textAlignVertical: 'center' }}
                                            numberOfLines={3}
                                            ellipsizeMode='tail'>
                                            <Text style={{ fontWeight: '500' }}>
                                                Summary: </Text>
                                            {item.summary}
                                        </Text>
                                    </View>

                                </View>
                                <View style={{ flex: 0.1, flexDirection: 'row' }}>
                                    <Text style={{ flex: 0.5, fontSize: 10 }}>{item.request_type_name.replace(/_/g, " ")}</Text>
                                    <View style={[theme.StyleCommon.flexRight, { flexDirection: 'row-reverse' }]}>
                                        <FontAwesomeIcon icon={faClock} />
                                        <Text style={{ fontSize: 11, alignSelf: 'center', marginEnd: 5 }}>
                                            {moment(item.resolved_date.substring(0, 10), "YYYY-MM-DD").fromNow()}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                        </TouchableOpacity>) : <Text></Text>}
                </View>
            </ScrollView>
        </SafeAreaView >

    );

}
const styles = StyleSheet.create({
    table: { paddingStart: 20 },
    container: { flex: 1, paddingTop: 0, backgroundColor: '#fff' },
    head: { height: 80, backgroundColor: '#fff', borderBottomColor: '#9aaecb', borderBottomWidth: 1, flexDirection: 'row' },
    text: { margin: 5, color: "#000" },
    textHead: { margin: 5, fontWeight: 'bold', fontSize: 18, color: '#99adcb' }
});

export default TicketsDetail;
