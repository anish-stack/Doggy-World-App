import React from 'react';
import { ScrollView, Text, View } from 'react-native';


const PrivacyPolicy = () => {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-1">
      <View className="bg-white rounded-lg p-4 shadow-md">
        <Text className="text-2xl font-bold mb-4">Privacy Policy</Text>

        {/* Introduction */}
        <Text className="text-lg font-semibold mb-2">Introduction</Text>
        <Text className="text-sm mb-4">
          Your privacy is important to us. This Privacy Policy outlines the types of personal
          information we collect and how we use, disclose, and protect that information.
        </Text>

        {/* Data Collection */}
        <Text className="text-lg font-semibold mb-2">Information We Collect</Text>
        <Text className="text-sm mb-4">
          We collect the following types of information to provide better services:
          - Personal Information (e.g., name, email, phone number).
          - Payment Information (e.g., payment method, billing details).
          - Usage Information (e.g., interactions with our platform).
        </Text>

        {/* Usage of Information */}
        <Text className="text-lg font-semibold mb-2">How We Use Your Information</Text>
        <Text className="text-sm mb-4">
          We use your personal data to:
          - Provide our services and improve user experience.
          - Process transactions and send notifications.
          - Analyze trends to enhance our offerings.
        </Text>

        {/* Disclosure */}
        <Text className="text-lg font-semibold mb-2">Sharing Your Information</Text>
        <Text className="text-sm mb-4">
          We do not share your personal information with third parties except:
          - With service providers for operations.
          - If required by law or to protect our rights.
        </Text>

        {/* Data Security */}
        <Text className="text-lg font-semibold mb-2">Security of Your Information</Text>
        <Text className="text-sm mb-4">
          We implement a variety of security measures to protect your data from unauthorized access,
          alteration, disclosure, or destruction.
        </Text>

        {/* Cookies */}
        <Text className="text-lg font-semibold mb-2">Cookies</Text>
        <Text className="text-sm mb-4">
          We use cookies to understand user behavior and enhance your experience on our platform. You
          can opt out of cookies by adjusting your browser settings.
        </Text>

        {/* User Rights */}
        <Text className="text-lg font-semibold mb-2">Your Rights</Text>
        <Text className="text-sm mb-4">
          You have the right to access, update, or delete your personal information. Contact us for any
          privacy-related concerns.
        </Text>

        {/* Updates to Policy */}
        <Text className="text-lg font-semibold mb-2">Changes to This Policy</Text>
        <Text className="text-sm mb-4">
          We may update this policy from time to time. Please review this page periodically for any
          changes.
        </Text>

        {/* Contact Us */}
        <Text className="text-lg font-semibold mb-2">Contact Us</Text>
        <Text className="text-sm mb-4">
          If you have any questions about this Privacy Policy, please contact us at privacy@company.com.
        </Text>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;
