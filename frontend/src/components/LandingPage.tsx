import React, { useState, FormEvent } from "react";
import { Card, Button, Text, TextInput } from "@tremor/react";
import { UserIcon, BoltIcon, TrophyIcon, PlayIcon } from "@heroicons/react/24/outline";
import DartScorePreview from "./DartScorePreview";
import { userService, Credentials } from "../service/UserService";

// Define types for state management
interface LoginState {
  userName: string;
  password: string;
}

const LandingPage: React.FC = () => {
  const [isLoginVisible, setIsLoginVisible] = useState<boolean>(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginState>({
    userName: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const credentials: Credentials = {
      username: loginData.userName,
      password: loginData.password,
    };
    await userService.login(credentials);
    setIsLoginVisible(false);
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const credentials: Credentials = {
      username: loginData.userName,
      password: loginData.password,
    };
    await userService.signup(credentials);
    setIsRegisterVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      {/* Navigation Bar */}
      <nav className="w-full bg-blue-500 text-white p-4 flex justify-between items-center relative">
        <h1 className="text-xl font-bold">Dart Scorer</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setIsLoginVisible(!isLoginVisible);
              setIsRegisterVisible(false);
            }}
            className="ml-2 bg-white text-blue-500"
          >
            {isLoginVisible ? "Close Login" : "Login"}
          </Button>
          <Button
            onClick={() => {
              setIsRegisterVisible(!isRegisterVisible);
              setIsLoginVisible(false);
            }}
            className="ml-2 bg-white text-blue-500"
          >
            {isRegisterVisible ? "Close Register" : "Register"}
          </Button>
        </div>
      </nav>

      {/* Preview */}
      <div className="w-full max-w-4xl mt-12">
        <h2 className="text-2xl font-bold text-center mb-6">Preview</h2>
        <DartScorePreview playerNames={["Alice", "Bob"]} />
      </div>

      {/* Main Content */}
      <div className="flex flex-wrap justify-center gap-8 mt-12 p-4 w-full max-w-4xl">
        <Card className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl w-80">
          <BoltIcon className="w-12 h-12 text-indigo-500 mb-4" />
          <Text className="font-semibold text-lg">Score Tracking</Text>
          <Text className="text-center mt-2">Keep track of scores easily and efficiently.</Text>
        </Card>
        <Card className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl w-80">
          <TrophyIcon className="w-12 h-12 text-yellow-500 mb-4" />
          <Text className="font-semibold text-lg">Leaderboard</Text>
          <Text className="text-center mt-2">View rankings and achievements in real time.</Text>
        </Card>
        <Card className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl w-80">
          <PlayIcon className="w-12 h-12 text-green-500 mb-4" />
          <Text className="font-semibold text-lg">Games</Text>
          <Text className="text-center mt-2">Play different types of dart games.</Text>
        </Card>
        <Card className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl w-80">
          <BoltIcon className="w-12 h-12 text-blue-500 mb-4" />
          <Text className="font-semibold text-lg">Stats</Text>
          <Text className="text-center mt-2">Analyze your performance and progress.</Text>
        </Card>
      </div>

      {/* Support Contact Form */}
      <div className="w-full bg-gray-100 py-10 px-6 mt-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Contact Support</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2 font-medium">Name</label>
              <TextInput id="name" name="name" placeholder="Your Name" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 font-medium">Email</label>
              <TextInput id="email" name="email" type="email" placeholder="you@example.com" className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label htmlFor="message" className="mb-2 font-medium">Message</label>
              <textarea id="message" name="message" rows={4} placeholder="How can we help you?" className="w-full p-2 border border-gray-300 rounded-lg resize-none" />
            </div>
            <div className="md:col-span-2 flex justify-center">
              <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Login Overlay */}
      {isLoginVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end items-start p-4">
          <Card className="w-80 p-6 bg-white shadow-md rounded-xl relative">
            <Button onClick={() => setIsLoginVisible(false)} variant="secondary" className="absolute top-2 right-2 text-gray-600">X</Button>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="userName" className="block text-sm font-semibold mb-2">Username</label>
                <TextInput type="text" id="userName" name="userName" value={loginData.userName} onChange={handleInputChange} required />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
                <TextInput type="password" id="password" name="password" value={loginData.password} onChange={handleInputChange} required />
              </div>
              <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">Login</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Register Overlay */}
      {isRegisterVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end items-start p-4">
          <Card className="w-80 p-6 bg-white shadow-md rounded-xl relative">
            <Button onClick={() => setIsRegisterVisible(false)} variant="secondary" className="absolute top-2 right-2 text-gray-600">X</Button>
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label htmlFor="userName" className="block text-sm font-semibold mb-2">Username</label>
                <TextInput type="text" id="userName" name="userName" value={loginData.userName} onChange={handleInputChange} required />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
                <TextInput type="password" id="password" name="password" value={loginData.password} onChange={handleInputChange} required />
              </div>
              <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600">Register</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
