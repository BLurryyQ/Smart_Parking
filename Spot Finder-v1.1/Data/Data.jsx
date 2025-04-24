import Onboard1 from "../assets/images/onboard_img1.png";
import Onboard2 from "../assets/images/onboard_img2.png";
import Onboard3 from "../assets/images/onboard_img3.png";

import Google from "../assets/images/Google.svg";
import Apple from "../assets/images/Apple.svg";
import Dark_Apple from "../assets/images/Dark_Apple.svg";

import Parking1 from "../assets/images/parking1.png";
import Parking2 from "../assets/images/parking2.png";
import Parking3 from "../assets/images/parking3.png";
import Parking4 from "../assets/images/parking4.png";

import Car1 from "../assets/images/car1.svg";
import Car2 from "../assets/images/car2.svg";
import Car3 from "../assets/images/car3.svg";
import Car4 from "../assets/images/car4.svg";
import Car5 from "../assets/images/car5.svg";
import Car6 from "../assets/images/car6.svg";

import Clock from "../assets/images/clock.svg";
import Car from "../assets/images/car.svg";
import Ticket from "../assets/images/ticket.svg";

import Paypal from '../assets/images/paypal.svg';
import Phonepay from '../assets/images/phonepay.svg';

import Car8 from "../assets/images/car8.png";

import Profile1 from "../assets/images/profile1.svg";
import Profile2 from "../assets/images/profile2.svg";
import Profile3 from "../assets/images/profile3.svg";
import Profile4 from "../assets/images/profile4.svg";
import Profile5 from "../assets/images/profile5.svg";
import Profile6 from "../assets/images/profile6.svg";

import Dark_profile1 from "../assets/images/dark_profile1.svg";
import Dark_profile2 from "../assets/images/dark_profile2.svg";
import Dark_profile3 from "../assets/images/dark_profile3.svg";
import Dark_profile4 from "../assets/images/dark_profile4.svg";
import Dark_profile5 from "../assets/images/dark_profile5.svg";
import Dark_profile6 from "../assets/images/dark_profile6.svg";

export const pages = [
    {
        id: 1,
        image: Onboard1,
        heading: 'Welcome to ParkEase!',    
        Text: 'ParkEase helps you find and book the best parking spots in seconds.',
        
    },
    {
        id: 2,
        image: Onboard2,
        heading: 'Quick Booking',
        Text: 'Quickly search for parking, compare options, and book instantly—all from your smartphone.',

    },
    {
        id: 3,
        image: Onboard3,
        heading: 'No More Waiting Tickets',
        Text: 'Enjoy peace of mind with our verified parking spots and secure payment options.',

    },
]


export const log_methods = [
    {
        id: 1,
        image: <Google />, 
        dark_image: <Google />,
        text: 'Sign Up with Google',
    },
    {
        id: 2,
        image: <Apple />, 
        dark_image: <Dark_Apple />,
        text: 'Sign Up with Apple',
    },
]

export const popular = [
    {
        id: 1,
        image: Parking1,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'ParkSecure',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '1 hour',
        vehicle: '28 Spots',
        headingId: 1, 
    },
    {
        id: 2,
        image: Parking2,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'SpacePark',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '2 hour',
        vehicle: '28 Spots',
        headingId: 1, 
    },
    {
        id: 3,
        image: Parking3,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'ParkZone',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '3 hour',
        vehicle: '28 Spots',
    },
    {
        id: 4,
        image: Parking4,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'SpotSafe',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '1 hour',
        vehicle: '28 Spots',
    },
]


export const popular2 = [
    {
        id: 1,
        image: Parking1,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'ParkSecure',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '1 hour',
        vehicle: '28 Spots',
        headingId: 1, 
        btn1: 'Timer',
        btn2: 'E-Ticket',
    },
    {
        id: 2,
        image: Parking2,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'SpacePark',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '2 hour',
        vehicle: '28 Spots',
        headingId: 1, 
        btn1: 'Cancel',
        btn2: 'E-Ticket',
    },
    {
        id: 3,
        image: Parking3,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'ParkZone',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '3 hour',
        vehicle: '28 Spots',
        headingId: 1, 
        btn1: 'Cancel',
        btn2: 'E-Ticket',
    },
    {
        id: 4,
        image: Parking4,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'SpotSafe',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '1 hour',
        vehicle: '28 Spots',
        headingId: 1, 
        btn1: 'Cancel',
        btn2: 'E-Ticket',
    },
    {
        id: 5,
        image: Parking1,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'ParkSecure',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '1 hour',
        vehicle: '28 Spots',
        headingId: 2, 
        btn1: 'Re-book',
        btn2: 'E-Ticket',
    },
    {
        id: 6,
        image: Parking2,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'SpacePark',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '2 hour',
        vehicle: '28 Spots',
        headingId: 2, 
        btn1: 'Re-book',
        btn2: 'E-Ticket',
    },
    {
        id: 7,
        image: Parking3,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'ParkZone',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '3 hour',
        vehicle: '28 Spots',
        headingId: 2, 
        btn1: 'Re-book',
        btn2: 'E-Ticket',
    },
    {
        id: 8,
        image: Parking4,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'SpotSafe',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '1 hour',
        vehicle: '28 Spots',
        headingId: 3, 
        btn: 'Re-book',
    },
    {
        id: 9,
        image: Parking1,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'ParkSecure',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '1 hour',
        vehicle: '28 Spots',
        headingId: 3, 
        btn: 'Re-book',
    },
    {
        id: 10,
        image: Parking2,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'SpacePark',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '2 hour',
        vehicle: '28 Spots',
        headingId: 3,
        btn: 'Re-book',
    },
    {
        id: 11,
        image: Parking3,
        rating: '4.9',
        parking: 'Car Parking',
        name: 'ParkZone',
        price: '5.00 MAD',
        timing: ' /1hr',
        timing2: '3 hour',
        vehicle: '28 Spots',
        headingId: 3, 
        btn: 'Re-book',
    },
]

export const booking_heading = [
    { id: 1, text: "Ongoing" },
    { id: 2, text: "Completed" },
    { id: 3, text: "Cancelled" },
  ];
  

  export const tab_heading = [
    { id: 1, text: "About" },
    { id: 2, text: "Gallery" },
    { id: 3, text: "Review" },
  ];
  

  
export const time_tab = [
    {
        id: 1,
        time: '08:00 AM',
    },
    {
        id: 2,
        time: '08:30 AM',
    },
    {
        id: 3,
        time: '09:00 AM',
    },
    {
        id: 4,
        time: '11:30 AM',
    },
    {
        id: 5,
        time: '12:30 AM',
    },
    {
        id: 6,
        time: '02:00 PM',
    },
    {
        id: 7,
        time: '06:00 PM',
    },
    {
        id: 8,
        time: '10:00 PM',
    },

]


export const vehicle_data = [
    {
        id: 1,
        image: <Car1 />,
        company: 'Audi',
        modal: 'Sedan',
        modalno: 'GR 123-ABCD',
    },
    {
        id: 2,
        image: <Car2 />,
        company: 'Toyota Fortuner',
        modal: 'SUV',
        modalno: 'GR 123-ABCD',
    },
    {
        id: 3,
        image: <Car3 />,
        company: 'Hyunndai Verna',
        modal: 'Sedan',
        modalno: 'GR 123-ABCD',
    },
    {
        id: 4,
        image: <Car4 />,
        company: 'Toyota Innova',
        modal: 'MPV',
        modalno: 'GR 123-ABCD',
    },
    {
        id: 5,
        image: <Car5 />,
        company: 'Ford Endeavour',
        modal: 'SUV',
        modalno: 'GR 123-ABCD',
    },
    {
        id: 6,
        image: <Car6 />,
        company: 'Toyota Fortuner',
        modal: 'SUV',
        modalno: 'GR 123-ABCD',
    },
]


export const review_data = [
    {
        id: 1,
        icon: <Clock />,
        text: 'Arriving Time',
        value: '08:00 AM',
    },
    {
        id: 2,
        icon: <Clock />,
        text: 'Exit Time',
        value: '09:00 AM',
    },
    {
        id: 3,
        icon: <Car />,
        text: 'Vehicle',
        value: 'Toyota fortuner (SUV)',
    },
    {
        id: 4,
        icon: <Ticket />,
        text: 'Slot',
        value: '3 Ticket',
    },
]

export const review_data2 = [
    {
        id: 1,
        text: 'Amount',
        value: '62.00 MAD',
    },
    {
        id: 2,
        text: 'Total Hours',
        value: '2.50 MAD',
    },
    {
        id: 3,
        text: 'fees',
        value: '2.50 MAD',
    },

]

export const pay_card = [
    {
        id: 1,
        icon: <Paypal />,
        text: 'PayPal',
    },
    {
        id: 2,
        icon: <Phonepay />,
        text: 'phone pay',
    }
]


export const receipt_data = [
    {
        id: 1,
        icon: <Clock />,
        text: 'Arriving Time',
        value: '08:00 AM',
    },
    {
        id: 2,
        icon: <Clock />,
        text: 'Exit Time',
        value: '09:00 AM',
    },
    {
        id: 3,
        icon: <Ticket />,
        text: 'Slot',
        value: 'A05 (1st Floor)',
    },
]

export const receipt_data2 = [
    {
        id: 1,
        text: 'Car',
        value: 'Toyota fortuner (SUV)',
    },
    {
        id: 2,
        text: 'Car Number',
        value: 'GR 456 -EFGH',
    },
    {
        id: 3,
        text: 'Parking',
        value: 'SecurePark',
    },
]

export const receipt_data3 = [
    {
        id: 1,
        text: 'Price',
        value: '62.00 MAD',
    },
    {
        id: 2,
        text: 'Fees',
        value: '2.50 MAD',
    },
]


export const timer_datas = [
    {
        id: 1,
        text: 'Name',
        text1: 'Vehicle Number Plate',
        value: 'Minato Namikaza',
        value2: 'GR 456-EFGH',
    },
    {
        id: 2,
        text: 'Parking',
        text1: 'Parking Slot',
        value: 'SpacePark',
        value2: 'A05 (1st Floor)',
    },
    {
        id: 3,
        text: 'Arrive Time',
        text1: 'Exit Time',
        value: '08:00 AM',
        value2: '09:00 AM',
    },
    {
        id: 4,
        text: 'Date',
        text1: 'Total Payment',
        value: '16 June',
        value2: '64.00 MAD',
    },
]


export const extend_data = [
    {
        id: 1,
        time: '30 Mins',
    },
    {
        id: 2,
        time: '1 Hour',
    },
    {
        id: 3,
        time: '2 Hour',
    },
    {
        id: 4,
        time: '3 Hour',
    },
    {
        id: 5,
        time: '4 Hour',
    },
    {
        id: 6,
        time: '5 Hour',
    },
]


export const wallet_tab_data = [
    {
        id: 1,
        name: 'Money Added to Wallet',
        price: '+500 MAD',
        time: '03 October | 5:30 AM',
        balance: 'Balance 15,000.00 MAD',
    },
    {
        id: 2,
        name: 'Booking No #23456',
        price: '+500 MAD',
        time: '03 October | 5:30 AM',
        balance: 'Balance 15,000.00 MAD',
    },
    {
        id: 3,
        name: 'Money Added to Wallet',
        price: '+500 MAD',
        time: '03 October | 5:30 AM',
        balance: 'Balance 15,000.00 MAD',
    },
    {
        id: 4,
        name: 'Booking No #23456',
        price: '+500 MAD',
        time: '03 October | 5:30 AM',
        balance: 'Balance 15,000.00 MAD',
    },
    {
        id: 5,
        name: 'Money Added to Wallet',
        price: '+500 MAD',
        time: '03 October | 5:30 AM',
        balance: 'Balance 15,000.00 MAD',
    },
    {
        id: 6,
        name: 'Booking No #23456',
        price: '+500 MAD',
        time: '03 October | 5:30 AM',
        balance: 'Balance 15,000.00 MAD',
    },
    {
        id: 7,
        name: 'Money Added to Wallet',
        price: '+500 MAD',
        time: '03 October | 5:30 AM',
        balance: 'Balance 15,000.00 MAD',
    },
]


export const parking_slot_data = [
    {
        id: 1,
        parking: Car8,
    },
    {
        id: 2,
        parking: 'A03',
    },
    {
        id: 3,
        parking: 'A05',
    }
]

export const parking_slot_data2 = [
    {
        id: 1,
        parking: 'A02',
    },
    {
        id: 2,
        parking: Car8,
    },
    {
        id: 3,
        parking: Car8,
    }
]

export const parking_slot_data3 = [
    {
        id: 1,
        parking: Car8,
    },
    {
        id: 2,
        parking: Car8,
    },
    {
        id: 3,
        parking: 'A11',
    }
]
export const parking_slot_data4 = [
    {
        id: 1,
        parking: 'A08',
    },
    {
        id: 2,
        parking: Car8,
    },
    {
        id: 3,
        parking: Car8,
    }
]




export const profile_data = [
    {
        id: 1,
        icon: <Profile1 />,
        active_icon: <Dark_profile1 />,
        name: 'Payment Method',
    },
    {
        id: 2,
        icon: <Profile6 />,
        active_icon: <Dark_profile6 />,
        name: 'Wallet',
    },
    {
        id: 3,
        icon: <Profile2 />,
        active_icon: <Dark_profile2 />,
        name: 'Notifications',
    },
    {
        id: 4,
        icon: <Profile3 />,
        active_icon: <Dark_profile3 />,
        name: 'Dark Mode',
    },
    {
        id: 5,
        icon: <Profile4 />,
        active_icon: <Dark_profile4 />,
        name: 'Help & Support',
    },
    {
        id: 6,
        icon: <Profile5 />,
        active_icon: <Dark_profile5 />,
        name: 'Language',
    },
]