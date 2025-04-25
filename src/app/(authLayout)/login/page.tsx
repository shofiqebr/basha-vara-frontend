"use client";

import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginInputs {
  email: string;
  password: string;
}

interface RegisterInputs {
  name: string;
  email: string;
  password: string;
  role: "landlord" | "tenant";
}

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginInputs>();

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterInputs>();

  const onLoginSubmit: SubmitHandler<LoginInputs> = async (data) => {
    // console.log(data)
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result)
      if (!res.ok) throw new Error(result.message || "Login failed");
      localStorage.setItem("loginData", JSON.stringify(result?.data));
      if(result?.data){

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result)
     
      if (!res.ok) throw new Error(result.message || "Registration failed");
      if(result?.data){

        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      setIsLogin(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[700px] flex justify-center items-center">
        <div className="bg-gray-900 text-white p-8 rounded-lg max-w-lg w-full">
          <h2 className="text-2xl font-semibold text-yellow-500 mb-4">
            {isLogin ? "Login" : "Register"}
          </h2>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              <input
                {...loginRegister("email", { required: "Email is required" })}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Email"
              />
              {loginErrors.email && <p className="text-red-500">{loginErrors.email.message}</p>}
              
              <input
                type="password"
                {...loginRegister("password", { required: "Password is required" })}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Password"
              />
              {loginErrors.password && <p className="text-red-500">{loginErrors.password.message}</p>}

              <button type="submit" className="w-full bg-yellow-500 py-2 rounded-lg" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
              <input {...registerRegister("name", { required: "Username is required" })} className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Username" />
              {registerErrors.name && <p className="text-red-500">{registerErrors.name.message}</p>}
              
              <input type="email" {...registerRegister("email", { required: "Email is required" })} className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Email" />
              {registerErrors.email && <p className="text-red-500">{registerErrors.email.message}</p>}
              
              <input type="password" {...registerRegister("password", { required: "Password is required" })} className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Password" />
              {registerErrors.password && <p className="text-red-500">{registerErrors.password.message}</p>}
              
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" value="landlord" {...registerRegister("role", { required: "Role is required" })} />
                  <span className="ml-2">Landlord</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" value="tenant" {...registerRegister("role", { required: "Role is required" })} />
                  <span className="ml-2">Tenant</span>
                </label>
              </div>
              {registerErrors.role && <p className="text-red-500">{registerErrors.role.message}</p>}
              
              <button type="submit" className="w-full bg-yellow-500 py-2 rounded-lg" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          )}

          <button className="w-full mt-4 text-gray-400 hover:text-white underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
      <Footer />
      <ToastContainer/>
    </>
  );
};

export default AuthForm;
