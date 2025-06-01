import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ActionButton = ({ icon, count, isActive, onPress, color = '#fff' }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconWrapper, isActive && styles.iconActive]}>
        <Icon 
          name={icon} 
          size={28} 
          color={isActive && color ? color : '#fff'} 
        />
      </View>
      {count !== undefined && (
        <Text style={styles.countText}>{formatCount(count)}</Text>
      )}
    </TouchableOpacity>
  );
};

const formatCount = (count) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 25,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconActive: {
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default ActionButton;