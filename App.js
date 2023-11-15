import { StyleSheet, View, Text} from 'react-native';
import Mapbox, {PointAnnotation} from '@rnmapbox/maps';
import { useState, useEffect } from 'react';

//async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

Mapbox.setAccessToken('pk.eyJ1IjoiamFrZW9ydG9uOTkiLCJhIjoiY2xvNWpwODMwMDk3ZDJzbnc0ZGVlYndwbyJ9.5kTp4H34XApnFU4oEEKcFA');

// fetching locations & location data 
const fetchData = async () => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Jxkeorton/APIs/main/worldlocations.json');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    const locations = data.locations;
  
    return locations;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const saveEventToStorage = async (event) => {
  try {
    // Create a new event object with an integer ID
    const eventWithIntegerId = {
      ...event,
      id: parseInt(event.id, 10) // Parse the ID as an integer
    };

    let savedEvents = await AsyncStorage.getItem('savedEvents');
    if (savedEvents) {
      savedEvents = JSON.parse(savedEvents);
    } else {
      savedEvents = [];
    }

    // Add the new event to the list
    savedEvents.push(eventWithIntegerId);

    // Ensure that the list doesn't exceed the maximum limit (10)
    if (savedEvents.length > 10) {
      savedEvents.shift(); // Remove the oldest event
    }

    await AsyncStorage.setItem('savedEvents', JSON.stringify(savedEvents));
    
  } catch (error) {
    console.error('Error saving event to AsyncStorage:', error);
  }
};


export default function App() {
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    async function fetchDataAndSetState() {
      const locations = await fetchData();
      setEventData(locations);
    }

    fetchDataAndSetState();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Mapbox.MapView 
          style={styles.map} 
          zoomEnabled={true}
          styleURL='mapbox://styles/jakeorton99/clopszx4t00k101pb70b0crpc'
          rotateEnabled={true}
          pitchEnabled={true}
          compassEnabled={true}
        >
          <Mapbox.Camera zoomLevel={3}
            centerCoordinate={[-1.097498, 52.653417]} />
          <Mapbox.PointAnnotation
              id='3000'
              coordinate={[-1.097498, 52.653417]}
            />
         {eventData.map((event, index) => (
            <Mapbox.PointAnnotation
              key={index}
              id={event.id.toString()}
              coordinate={[event.coordinates[0], event.coordinates[1]]}
              onSelected={() => saveEventToStorage(event)}
            />
          ))}  
        
        </Mapbox.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1
  },
  small: {
    backgroundColor: 'blue',
   
    justifyContent: 'center',
    
    flex: 1,
  },
});
