import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Animated,
  Easing,
  Image,
  TouchableOpacity
} from 'react-native';
import theme from '../theme';


export const Card = ({ children, title, icon, action }) => {
  const [imageError, setImageError] = useState(false);
  const _onImageLoadError = (event) => {
    // console.warn(event.nativeEvent.error);
    setImageError(true);
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => (action instanceof Function) ? action() : null}
      style={[{}, theme.StyleCommon.flexRow]}>
      <View style={theme.StyleCommon.cardH9}>
        <View style={theme.StyleCommon.cardContainer}>
          <View style={theme.StyleCommon.cardBody}>
            <Text style={theme.StyleCommon.cardTitle}>
              {title}
            </Text>
            <View
              style={{}}>
              {children}
            </View>
          </View>
          <View style={{ flex: 0.2, justifyContent: 'center' }}>

            {(icon != null) ?
              icon == '' ? null :
                <Image
                  accessible
                  accessibilityLabel={title}
                  source={icon}
                  onError={_onImageLoadError}
                  style={theme.StyleCommon.icon}
                  resizeMode='contain' />
              : <Text style={theme.StyleCommon.iconAlt}>
                Icon
              </Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export const CardProject = ({ children, title, addHeader }) => {
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
export const CardItem = ({ title, name, image, action, moreAction }) => {

  return (

    <View style={theme.StyleCommon.cardItem}>
      <TouchableOpacity
        onPress={() => (action instanceof Function) ? action() : null}
        style={[{}, theme.StyleCommon.flexRow]}>
        <View style={{ flex: 0.3, paddingHorizontal: 15, paddingVertical: 5 }}>
          <Image source={image}
            style={{ width: '100%', height: 50, borderRadius: 10 }}
            resizeMode='contain' />
        </View>
        <View style={{ flex: 0.7 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 14, }}>
            {title}
          </Text>
          <Text style={{ flexWrap: 'nowrap' }}>
            {name}
          </Text>
        </View>
      </TouchableOpacity >
      {/* <View style={{ alignItems: 'stretch' }}>
        <TouchableOpacity
          onPress={() => (moreAction instanceof Function) ? moreAction() : null}>
          <Image
            source={require('../asset/more.png')}
            style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}