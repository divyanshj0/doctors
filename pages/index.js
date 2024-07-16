import About from "@/components/about";
import Form from "@/components/form";
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        <title>Appointment</title>
        <meta name="description" content="book the slot for consultance" />
      </Head>
      <div className="flex flex-col-reverse md:flex-row justify-between items-center md:mx-20 min-h-[70vh] bg-gray-100">
        <About />
        <Form />
      </div>
    </>
  );
} 
