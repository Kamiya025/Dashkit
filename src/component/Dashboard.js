import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart
} from "react-native-chart-kit";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Swiper from 'react-native-swiper';
import theme from '../theme';
import { Card, CardProject, CardItem } from './Card';
import { useUser } from "../../UserContext";
import { baseUrl, statusRequestToIcon, capitalizeFirstLetter, stringToRGB } from '../util';

const Dashboard = ({ navigation }) => {
  const user = useUser();
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    barPercentage: 0.5,
    decimalPlaces: 0.1,
    color: (opacity = 1) => `rgba(44, 123, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(149, 170, 201, ${opacity})`,
    propsForBackgroundLines: {
      strokeWidth: 0
    }
  };
  const ticketStatusAllByStaff = useQuery({
    queryKey: 'ticketStatusAllByStaff',
    queryFn: async () => {
      let response = await axios.get(`${baseUrl}/staff/ticketStatusAllByStaff/`,
        { headers: { token: user.accessToken } });
      return response.data;
    }, onSuccess: (data) => {
      changeDatapieChart(data.requests);
      changeDataBarChart(data.status, data.status.map(item => capitalizeFirstLetter(item.statusName.replace(/_/g, " ").replace(" REQUEST", " ").toLowerCase())));
    }
  });

  const timeSpent = useQuery({
    queryKey: 'timeSpent',
    queryFn: async () => {
      let response = await axios.get(`${baseUrl}/staff/getTimeSpent/`,
        { headers: { token: user.accessToken } });
      return response.data;
    }, onSuccess: (data) => {
      changeDataLineChart(data.details);
    }
  });
  const allProjects = useQuery({
    queryKey: 'allProjects',
    queryFn: async () => {
      let response = await axios.get(`${baseUrl}/staff/getAllProjects/`,
        { headers: { token: user.accessToken } });
      return response.data;
    }
  });
  const [dataBarChart, setDataBarChart] = useState({
    datasets: [{ data: [0] }]
  });
  const [dataLineChart, setDataLineChart] = useState({
    datasets: [{ data: [0] }]
  });
  const [dataPieChart, setDataPieChart] = useState([]);
  const changeDatapieChart = (dataRequests) => {
    let listColor = ["#2c7be5", "#a6c5f7", "#d2ddec"];
    let arrayData =
      setDataPieChart(dataRequests.map((item, index) => ({
        name: capitalizeFirstLetter(item.requestName.replace(/_/g, " ").replace(" REQUEST", " ")),
        value: item.quantity,
        color: listColor[index],
        legendFontColor: "#7F7F7F",
        legendFontSize: 10
      }
      )));
  }
  const changeDataBarChart = (dataStatus, labels) => {

    setDataBarChart({
      labels: labels,
      datasets: [
        {
          data: dataStatus.map(item => item.quantity)
        }
      ]
    });
  }

  const changeDataLineChart = (details) => {

    setDataLineChart({
      datasets: [
        {
          data: details
        }
      ]
    });
  }
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const [barChartWidth, setBarChartWidth] = useState(Dimensions.get("window").width);
  const [lineChartWidth, setLineChartWidth] = useState(Dimensions.get("window").width);
  const [chartHeight, setChartHeight] = useState(250);
  const [refreshing, setRefreshing] = useState(false);
  Dimensions.addEventListener('change', () => { changeBarChartWitdh(); changeLineChartWitdh() });
  useEffect(() => changeBarChartWitdh, [dataBarChart]);
  useEffect(() => changeLineChartWitdh, [dataLineChart])
  const changeBarChartWitdh = () => {
    setBarChartWidth(((dataBarChart.datasets[0].data.length * 10 + 200) < Dimensions.get("window").width - 40)
      ? Dimensions.get("window").width - 40
      : (dataBarChart.datasets[0].data.length * 100 + 300));
    setScreenWidth(Dimensions.get("window").width);
  }
  const changeLineChartWitdh = () => {
    setLineChartWidth(((dataLineChart.datasets[0].data.length * 10 + 200) < Dimensions.get("window").width - 40)
      ? Dimensions.get("window").width - 40
      : (dataLineChart.datasets[0].data.length * 10 + 200));
    setScreenWidth(Dimensions.get("window").width);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    timeSpent.refetch();
    ticketStatusAllByStaff.refetch().then(() => setRefreshing(false));
  }, []);
  return (
    <SafeAreaView style={theme.StyleDashboard.container}>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        scrollEnabled={true}>

        <View
          style={theme.StyleDashboard.mainContext}>

          <View style={theme.StyleDashboard.header}>
            <View style={{ alignItems: 'flex-start', flex: 0.5 }}>
              <Text style={theme.StyleDashboard.headerPretitle}>overview</Text>
              <Text style={theme.StyleDashboard.headerTitle}>
                Dashboard
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', flex: 0.5 }}>
              <TouchableOpacity
                onPress={() => navigation.push('CreateTicket')}>
                <View style={theme.StyleCommon.btnPrimary}>
                  <Text style={theme.StyleCommon.btnPrimaryText}>Create Ticket</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'column', flexWrap: 'nowrap', marginVertical: 20 }}>
            {
              ticketStatusAllByStaff.isLoading
                ? <ActivityIndicator size="large" color={'#fff'} />
                :
                <Swiper
                  showsButtons={false}
                  height={150}
                  autoplay={true}
                  autoplayTimeout={6}
                  paginationStyle={{ alignItems: "flex-end" }}
                >{
                    ticketStatusAllByStaff.data.status.map(item =>
                      <View
                        style={{ height: 90 }}
                        key={item.statusName}>
                        <Card
                          title={item.statusName.replace(/_/g, " ")}
                          action={() => { navigation.navigate('TicketsDetail', { ticketsType: item.statusName }); }}
                          icon={statusRequestToIcon(item.statusName)}>
                          <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold'
                          }}>
                            {item.quantity}

                          </Text>
                        </Card>
                      </View>)}
                </Swiper>
            }
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: -30 }}>

            <View style={theme.StyleDashboard.chartBox}>
              <Text style={theme.StyleDashboard.chartBoxTitle}>Ticket status</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={dataBarChart}
                  width={barChartWidth}
                  height={chartHeight}
                  chartConfig={chartConfig}
                  yLabelsOffset={35}
                  yAxisInterval={0}
                  xLabelsOffset={-8}
                  verticalLabelRotation={30}
                  showValuesOnTopOfBars
                  withInnerBars={true}
                  fromZero={true}
                  style={[theme.StyleDashboard.chartBox]}
                />
              </ScrollView>
            </View>

            <View style={theme.StyleDashboard.chartBox}>
              <Text style={theme.StyleDashboard.chartBoxTitle}>Ticket type</Text>
              <PieChart
                data={dataPieChart}
                width={screenWidth - 40}
                height={chartHeight}
                chartConfig={chartConfig}
                avoidFalseZero={false}
                accessor={"value"}
                backgroundColor={"#fff"}
                paddingLeft={"30"}
                center={[5, 5]}
                absolute
              />
            </View>

            <View style={theme.StyleDashboard.chartBox}>
              <Text style={theme.StyleDashboard.chartBoxTitle}>Time spent</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={dataLineChart}
                  width={lineChartWidth}
                  height={chartHeight}
                  withDots={true}
                  bezier={true}
                  chartConfig={chartConfig}
                  withInnerBars={true}
                  fromZero={true} style={theme.StyleDashboard.chartBox}
                />
              </ScrollView>
            </View>
          </View>

          <CardProject
            title={"Project"}>
            {allProjects.isLoading
              ? <ActivityIndicator size="large" color={'#fff'} />
              : allProjects.data.details.map(item =>
                <CardItem
                  key={`pj_${item.id}`}
                  title={item.project_code}
                  name={item.name}
                  image={{ uri: item.image }}
                />)}

          </CardProject>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};


export default Dashboard;