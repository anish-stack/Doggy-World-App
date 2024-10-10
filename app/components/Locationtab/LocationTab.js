import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Dimensions, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import location1 from '../../assets/saleoffer1.png';
import location2 from '../../assets/saleoffer2.png';
import location3 from '../../assets/saleoffer3.png';

const screenWidth = Dimensions.get('window').width;   

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex,
      });
    }
  }, [currentIndex]);

  return (
    <View style={styles.imageSliderContainer}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} />
        )}
      />
    </View>
  );
};

const LocationTab = ({ searchQuery }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = ['All', 'Near You', 'New Delhi', 'Noida', 'Gurugram', 'Patna'];

  const boxes = [
    { location: 'New Delhi', images: [location1, location2, location3], title: 'Doggy World, Rohini Sec-8', time: 'Opens at 9:00 AM to 8:00 PM', distance: '10.0 Km' },
    { location: 'Noida', images: [location1, location2, location3], title: 'Doggy World, Rohini Sec-7', time: 'Opens at 9:00 AM to 8:00 PM', distance: '10.0 Km' },
    { location: 'Gurugram', images: [location1, location2, location3], title: 'Doggy World, Rohini Sec-6', time: 'Opens at 9:00 AM to 8:00 PM', distance: '10.0 Km' },
    { location: 'Patna', images: [location1, location2, location3], title: 'Doggy World, Rohini Sec-5', time: 'Opens at 9:00 AM to 8:00 PM', distance: '10.0 Km' },
    { location: 'Near You', images: [location1, location2, location3], title: 'Doggy World, Rohini Sec-5', time: 'Opens at 9:00 AM to 8:00 PM', distance: '10.0 Km' },
  ];

  const handleLocationPress = (location) => {
    setSelectedLocation(location === 'All' ? null : location);
  };

  const filteredBoxes = boxes.filter((box) => {
    const matchesLocation = selectedLocation ? box.location === selectedLocation : true;
    const matchesSearchQuery = searchQuery
      ? box.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        box.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesLocation && matchesSearchQuery;
  });

  return (
    <View>
      <FlatList
        data={locations}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationPress(item)} style={styles.locationButton}>
            <Text
              style={[
                styles.locationText,
                (selectedLocation === item || (item === 'All' && !selectedLocation))
                  ? styles.selectedLocation
                  : styles.unselectedLocation
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredBoxes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.boxContainer}>
            <ImageSlider images={item.images} />
            <View style={styles.infoContainer}>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <View style={styles.distanceContainer}>
                <FontAwesome name="map-marker" size={15} color="#64748b" />
                <Text style={styles.distance}>{item.distance}</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageSliderContainer: {
    height: 160,
    overflow: 'hidden',
    borderRadius: 20,
    width: screenWidth - 24,
  },
  image: {
    width: screenWidth - 24,
    height: 160,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  locationButton: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 2,
  },
  locationText: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 0.7,
    borderColor: 'gray',
    borderRadius: 20,
  },
  selectedLocation: {
    color: 'white',
    backgroundColor: '#ef5030',
    borderColor: '#ef5030',
  },
  unselectedLocation: {
    color: 'gray',
  },
  boxContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    color: 'slategray',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color: 'slategray',
  },
  distance: {
    marginLeft: 8,
    color: 'slategray',
  },
});

export default LocationTab;
