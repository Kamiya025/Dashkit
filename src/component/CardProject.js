import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import theme from '../theme';
const CardProject = ({ children, title, addHeader }) => {
    const [imageError, setImageError] = useState(false);
    const _onImageLoadError = (event) => {
        setImageError(true);
    }
    return (
        <View style={theme.StyleCommon.card}>
            <View style={theme.StyleCommon.cardHeader}>
                <Text style={[{ flexGrow: 0.9 }, theme.StyleCommon.cardHeaderTitle]}>Project</Text>
                <View style={{ alignSelf: 'center', color: '#2c7be5' }}>{addHeader}</View>
            </View >
            <View style={theme.StyleCommon.flexCol}>
                {children}
            </View>
        </View>
    );
};
export const CardItem = ({ title, time, image, action, moreAction }) => {

    return (

        <View style={theme.StyleCommon.cardItem}>
            <TouchableOpacity
                onPress={() => (action instanceof Function)?action():null}
                style={[{ flexGrow: 1 }, theme.StyleCommon.flexRow]}>
                <View style={{ paddingHorizontal: 5 }}>
                    <Image source={image}
                        style={{ width: 80, height: 50, borderRadius: 10 }}
                        resizeMode='contain' />
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, }}>
                        {title}
                    </Text>
                    <Text>
                        {time}
                    </Text>
                </View>
            </TouchableOpacity >
            <View style={{alignItems: 'stretch'}}>
                <TouchableOpacity
                onPress={()=>(moreAction instanceof Function)?moreAction():null}>
                    <Image
                        source={require('../asset/more.png')}
                        style={{ width: 20, height: 20}} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default CardProject;