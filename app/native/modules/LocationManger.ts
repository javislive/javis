import { NativeModules } from "react-native";

export interface ILocationManager {
  locate: (callback: (map?: { lat: number; lng: number }) => void) => void;
}

const LocationManager: ILocationManager = NativeModules.LocationManager;
export default LocationManager || {};
