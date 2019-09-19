import { NativeModules } from "react-native";

export interface IFileCache {
  cache: (
    uri: String,
    callback: (error: boolean, progress?: number, source?: string) => void
  ) => void;
}

const FileCache: IFileCache = NativeModules.FileCache;
export default FileCache || {};
