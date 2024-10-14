import React, { useEffect, useState } from 'react';

import { Provider, useDispatch, useSelector } from 'react-redux';
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Cart from './screens/Cart';
import Otp from './screens/auth/Otp';
import Payment from './screens/Payment';
import Login from './screens/auth/Login';
import Checkout from './screens/Checkout';
import Member from './screens/Member/Member';
import Register from './screens/auth/Register';
import Editprofile from './screens/auth/Editprofile';
import ProductDetails from './screens/ProductDetails';
import Clinic from './screens/Clinic';
import Grooming from './screens/Categories/Grooming';
import Vaccination from './screens/Categories/Vaccination';
import Dogfood from './screens/Categories/Dogfood';
import Catfood from './screens/Categories/Catfood';
import Toast from 'react-native-toast-message';
import Petshop from './screens/Categories/Petshop';
import Booknow from './screens/Booknow';
import Membership from './screens/Membership';
import Shop from './screens/Shop';
import ChatScreen from './screens/ChatScreen';
import DoctorProfileScreen from './screens/DoctorProfileScreen';
import AudioCallScreen from './screens/AudioCallScreen';
import ChatList from './screens/ChatList';
import DynamicScreen from './screens/DynamicScreen/DynamicScreen';
import SingleProduct from './screens/SingleProduct/SingleProduct';
import ShowSliders from './screens/auth/ShowSliders';
import { name as appName } from './app.json';
import OnboardingScreen from './screens/auth/Onboarding';
import PetType from './screens/auth/PetType';
import PetRegister from './screens/auth/PetRegister';
import VerificationStep from './screens/auth/VerificationStep';
import { store } from './redux/store';
import Loader from './components/Loader/Loader';
import PetLogin from './screens/auth/PetLogin';
import { checkAuthToken } from './redux/slice/Login.slice';
import Service from './screens/Service/Service';
import Branch from './screens/Branchs/Branch';
import Details from './screens/Branchs/Details';
import ChooseDate from './screens/Booking_step/ChooseDate';
import PaymentStep from './screens/Booking_step/PaymentStep';
import PaymentSuccessPage from './screens/Booking_step/PaymentSuccessPage';
import ProfileService from './screens/Member/Service';
import PrivacyPolicy from './screens/Policy/Policy';
import Orders from './screens/Orders/Orders';
import Doctors from './screens/doctors/Doctors';
import DateAndTime from './screens/Appoinements/DateAndTime';
import AppoinemntBook from './screens/Appoinements/AppoinemntBook';
import SuccessPage from './screens/Appoinements/SuccessPage';
import MyAppoinments from './screens/Member/MyAppoinments';
import HomeBranch from './screens/Branchs/HomeBranch';

//Routes
const Stack = createNativeStackNavigator();
const App = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthToken());
      setIsLoading(false);
    };
    checkAuth();
  }, [dispatch]);

  const { isAuthenticated } = useSelector((state) => state.auth);
  // console.log("i am at home ",useSelector((state) => state.auth))
  if (isLoading) {
    return <Loader />; // Show loader while checking auth
  }



  return (
    <NavigationContainer>
      <Stack.Navigator >

      {/* <Stack.Navigator initialRouteName={isAuthenticated ? 'home' : 'onboard'}> */}
        <Stack.Screen name='home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='clinic' component={Clinic} options={{ headerShown: false }} />
        <Stack.Screen name='grooming' component={Grooming} options={{ headerShown: false }} />
        <Stack.Screen name='vaccination' component={Vaccination} options={{ headerShown: false }} />
        <Stack.Screen name='dogfood' component={Dogfood} options={{ headerShown: false }} />
        <Stack.Screen name='catfood' component={Catfood} options={{ headerShown: false }} />
        <Stack.Screen name='petshop' component={Petshop} options={{ headerShown: false }} />
        <Stack.Screen name='booknow' component={Booknow} options={{ headerShown: false }} />
        <Stack.Screen name="DynamicScreen" options={{ headerShown: false }} component={DynamicScreen} />
        <Stack.Screen name="ProductDetailPage" options={{ headerShown: false }} component={SingleProduct} />
        <Stack.Screen name='sliders' options={{ headerShown: false }} component={ShowSliders} />
        <Stack.Screen name='onboard' options={{ headerShown: false }} component={OnboardingScreen} />
        <Stack.Screen name='PetRegister' options={{ headerShown: false }} component={PetRegister} />
        <Stack.Screen name='Verification' options={{ headerShown: false }} component={VerificationStep} />
        <Stack.Screen name='cart' options={{ headerShown: true, title: '🛒 Your Cart - Ready to Checkout' }} component={Cart} />

        <Stack.Screen name='Orders' options={{ headerShown: true, title: "Order For Your Buddy" }} component={Orders} />
        <Stack.Screen name='service' options={{ headerShown: true, title: "Pet Service With Happines" }} component={Service} />
        <Stack.Screen name='Branch' options={{ headerShown: true, title: "Our Branches" }} component={Branch} />
        <Stack.Screen name='HomeBranch' options={{ headerShown: true, title: "Our Clinic For You" }} component={HomeBranch} />

        <Stack.Screen name='details' options={{ headerShown: true, title: "Book Service For Your Buddy" }} component={Details} />
        <Stack.Screen name='further-step' options={{ headerShown: true, title: "Choose Your Sutable Time" }} component={ChooseDate} />
        <Stack.Screen name='Payment' options={{ headerShown: true, title: "Confirm Booking" }} component={PaymentStep} />
        <Stack.Screen name='Payement_Success' options={{ headerShown: true, title: "Your Service Have Been Booked" }} component={PaymentSuccessPage} />

        {/* Doctor sccren */}
        <Stack.Screen name='Doctor' options={{ headerShown: true, title: "Appointment with Your Doctor" }} component={Doctors} />
        <Stack.Screen name='Date-and-time' options={{ headerShown: true, title: "Schedule Your Ideal Time" }} component={DateAndTime} />
        <Stack.Screen name='Booking-step' options={{ headerShown: true, title: "Your Appointment Has Been Finalized" }} component={AppoinemntBook} />
        <Stack.Screen name='success-page' options={{ headerShown: true, title: "Your Appointment Has Been Booked" }} component={SuccessPage} />

        {/* Profile screen */}
        <Stack.Screen name='Profile' component={Member} />
        <Stack.Screen name='ProfileService' options={{ headerShown: true, title: "Your Service Have Been Booked" }} component={ProfileService} />
        <Stack.Screen name='My-Appointment' options={{ headerShown: true, title: "Appoinments" }} component={MyAppoinments} />

        <Stack.Screen name='petLogin' component={PetLogin} options={{ headerShown: false }} />
        <Stack.Screen name='otp' component={Otp} options={{ headerShown: false }} />
        <Stack.Screen name='payment' component={Payment} />
        <Stack.Screen name='login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='checkout' component={Checkout} />


        <Stack.Screen name='policy' options={{ headerShown: true, title: "Privacy Policy" }} component={PrivacyPolicy} />

        <Stack.Screen name='chatlist' component={ChatList} />
        <Stack.Screen name='shop' component={Shop} options={{ headerShown: false }} />
        <Stack.Screen name='membership' component={Membership} />
        <Stack.Screen name='register' component={Register} options={{ headerShown: false }} />
        <Stack.Screen name='PetType' component={PetType} options={{ headerShown: false }} />
        <Stack.Screen name='editProfile' component={Editprofile} />
        <Stack.Screen name='productDetails' component={ProductDetails} />
        <Stack.Screen name="Doctor Profile" options={{ headerShown: false }} component={DoctorProfileScreen} />
        <Stack.Screen name='chat' component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AudioCallScreen" component={AudioCallScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

// Wrap App in Provider at the root level
const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RootApp);

export default RootApp;
