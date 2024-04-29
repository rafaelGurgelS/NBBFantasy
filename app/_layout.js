import {Slot, Stcak} from 'expo-router';
import { Text, NativeBaseProvider } from 'native-base';



export default function AppLayout(){
    return(
        <NativeBaseProvider>
            <Slot/>
        </NativeBaseProvider>
    )
}