import { StyleSheet } from 'react-native';

const StyleDashboard = StyleSheet.create({
    mainContext: {
        padding: 20,
    },
    header: {
        flex: 1,
        marginVertical: 0,
        marginHorizontal: 0,
        paddingVertical: 25,
        borderRadius: 10,
        borderColor: '#e3ebf6',
        borderBottomWidth: 2,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    headerPretitle: {
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontSize: 13,
        marginBottom: 5,
        color: '#95aac9',
    },
    headerTitle: {
        fontWeight: '500',
        letterSpacing: 0.1,
        color: '#000',
        fontSize: 25
    },
    card: {
        flex: 1,
        margin: 0,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderColor: '#edf2f9',
        borderWidth: 1,
        flexDirection: 'row',
    },
    cardBody: {
        flex: 0.8
    },
    CardTitle: {
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    cardTitle: {
        color: '#95aac9',
        fontSize: 13,
        letterSpacing: 0.5,
        marginVertical: 8
    },
    highlight: {
        fontWeight: '700',
    },
    chartBox: {
        padding: 0,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 15,
        backgroundColor: "#fff",

    },
    chartBoxTitle: {
        fontSize: 18,
        fontWeight: '600',
        padding: 20,
        borderBottomColor: '#edf2f9',
        borderBottomWidth: 1,
    }

});
export default StyleDashboard;