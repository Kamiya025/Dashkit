import { StyleSheet } from 'react-native';

const StyleCommon = StyleSheet.create({

  container: {
    margin: 0,
    padding: 0,
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#f9fbfd',
    color: '#fff'
  },
  mainContext: {
    padding: 20,
    backgroundColor: '#f9fbfd',
  },
  heading: {
    alignSelf: 'center',
    fontSize: 35,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    color: "#000"
  },
  subheading: {
    alignSelf: 'center',
    color: '#95aac9',
    fontSize: 18,
    marginBottom: 25
  },
  avatar: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginEnd: 20,
    borderRadius: 30,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderWidth: 0
  },
  avataSmall: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2
  },
  form: {
    marginVertical: 0
  },
  label: {
    fontWeight: '500',
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 5,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#d2ddec',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  formInputBorderBottom: {
    width: '100%',
    borderBottomWidth: 3,
    borderBottomColor: '#d2ddec',
    padding: 10
  },
  formAreaInput: {
    borderWidth: 1,
    minHeight: 100,
    borderRadius: 10,
    borderColor: '#d2ddec',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  formInputError: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderColor: '#ff0000'
  },
  btnPrimary: {
    alignItems: "center",
    backgroundColor: '#2c7be5',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 10
  },
  btnSubmit: {
    alignItems: "center",
    backgroundColor: '#2c7be5',
    marginVertical: 30,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10
  },
  btnPage:{
    width:40,
    height:40,
    textAlign:'center',
    padding: 10, marginRight: 5,
    borderRadius:50, color:"#fff"},
  btnDisabled: {
    alignItems: "center",
    backgroundColor: '#c0c0c0',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10
  },
  textBtnDisabled: {
    color: '#c0c0c0',
  },
  textSelectDisabled: {
    textAlign: 'left',
    color: '#c0c0c0',
    fontSize: 13,
  },
  textSelect: {
    textAlign: 'left',
    alignContent: 'flex-start',
    color: '#000',
    fontSize: 13,
  },
  btnPrimaryText: {
    color: "#fff",
    lineHeight: 20,
    fontSize: 15,
    letterSpacing: 0.2
  },
  icon: {
    width: 25,
    height: 25,
    alignSelf: 'center',
    tintColor: '#95aac9',
    alignSelf: 'flex-end'
  },

  iconAlt: {
    color: '#95aac9',
    fontSize: 20,
    letterSpacing: 1,
    alignSelf: 'center'
  },
  textError: {
    fontSize: 12,
    marginVertical: 5,
    color: '#ff0000'
  },
  btnAsLink: {
    color: '#2c7be5',
    alignSelf: 'flex-end',
    marginHorizontal: 15,
    marginVertical: 10,
    flex: 0.1,
    borderBottomColor: '#2c7be5',
    borderBottomWidth: 1
  },
  card: {
    flex: 1,
    marginHorizontal: 0,
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#edf2f9',
    borderWidth: 1,
    shadowColor: '#12263f57',
    shadowOffset: {
      width: 7,
      height: 25
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    flexDirection: 'column',
  },
  cardH9: {
    flex: 1,
    height: 90,
    marginHorizontal: 0,
    marginVertical: 5,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderColor: '#edf2f9',
    borderWidth: 1,
    shadowColor: '#12263f57',
    shadowOffset: {
      width: 7,
      height: 25
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    flexDirection: 'column',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 5,
    margin: 0
  },
  cardHeader: {
    flexDirection: 'row',
    flexGrow: 1,
    margin: 0,
    padding: 10,
    borderBottomColor: '#edf2f9',
    borderBottomWidth: 1,
  },
  cardHeaderTitle: {
    fontWeight: 'bold',
    paddingHorizontal: 20,
    fontSize: 15
  },
  cardBody: {
    flex: 0.8
  },
  sectionTitle: {
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
  cardItem: {
    margin: 15,
    borderColor: '#edf2f9',
    borderBottomWidth: 1,
    paddingVertical: 20
  },
  highlight: {
    fontWeight: '700',
  },
  btnPrimary: {
    alignItems: "center",
    backgroundColor: '#2c7be5',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10
  },
  btnPrimaryAuto: {
    alignItems: "center",
    backgroundColor: '#2c7be5',
    width: 100,
    paddingVertical: 10,
    borderRadius: 10
  },
  btn: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    margin: 2
  },
  btnPrimary: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#2c7be5',
    margin: 2
  },
  btnEqual: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#2c7be5',
    margin: 2
  },
  btnPrimaryText: {
    color: "#fff",
    lineHeight: 20,
    fontSize: 13,
    textDecorationLine: 'none',
    letterSpacing: 0.8
  },

  flexCol: {
    flexDirection: 'column'
  },
  flexRow: {
    flexDirection: 'row'
  },
  flexRowReverse: {
    flexDirection: 'row-reverse'
  },
  flexLeft: {
    flex: 0.5,
    alignItems: "flex-start"
  },
  flexRight: {
    flex: 0.5,
    alignItems: 'flex-end'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    margin: 5
  },
  dotSmall: {
    width: 5,
    height: 5,
    borderRadius: 3 / 2,
    alignSelf: 'center',
    margin: 5
  },
  alignSelfCenter: { alignSelf: 'center' }
});
export default StyleCommon;