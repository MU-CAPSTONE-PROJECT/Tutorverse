import { GoogleMap, useJsApiLoader , Marker} from '@react-google-maps/api';
import { useContext, useState , useCallback} from "react";
import { UserContext } from "../../../../userContext";

export default function MapView( {tutors} ) {
    const { user } = useContext(UserContext);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCIpZqrYTmqR0pMG9vHXeEx_YK7QIdsXO8"
      })
    
      const [map, setMap] = useState(null)

      const containerStyle = {
        width: '100%',
        height: '100vh'
      };
      const center = {
                lat: user.latitude,
                lng: user.longitude
              }
      const onLoad = useCallback(function callback(map) {
       
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
    
        setMap(map)
      }, [map])
    
      const onUnmount = useCallback(function callback(map) {
        setMap(null)
      }, [])
    
      return isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            { tutors.map((tutor) => (
                <Marker 
                    key= {tutor.id}
                    position= {{lat: tutor.latitude,
                    lng:tutor.longitude}}
                />

            ))}
            
          </GoogleMap>
      ) : <></>
}
