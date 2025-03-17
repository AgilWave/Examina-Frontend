import React from 'react'
import Image from 'next/image'
import Logo from '@/public/imgs/landing-page/Footer/BottomLogo.png'
import LogoIn from '@/public/imgs/landing-page/Footer/instagram.png'
import LogoLn from '@/public/imgs/landing-page/Footer/linkedin.png'
import LogoYT from '@/public/imgs/landing-page/Footer/youtube.png'
import Logoarrow from '@/public/imgs/landing-page/Footer/ic Arrow Go.png'

function Footer() {
    return (


        <footer className="bg-white dark:bg-gray-900 w-full rounded-t-3xl md:rounded-t-[50px] ">
            <div className="bg-gray-50 flex flex-col justify-around items-start pt-20 rounded-t-3xl md:rounded-t-[50px] ">
                <div className="flex flex-col md:flex-row justify-around items-start w-full px-4">

                    <div className="w-[291px] px-5">
                        <ul>
                            <p className="text-gray-800 text-3xl pb-6">
                                <Image src={Logo} alt="examinaLogo" />
                            </p>
                            <div className="flex gap-6 pb-5">
                                <p className="text-gray-500 pb-4">AI-powered online examination platform for secure, scalable, and efficient test management with real-time analytics and proctoring.</p>
                            </div>
                        </ul>
                    </div>
                    <div className="px-5 pb-5 pt-3">
                        <ul>
                            <p className="text-gray-800 pb-2 ">Features</p>
                            <p className="text-gray-800 pb-2 ">Contact us</p>
                            <p className="text-gray-800 pb-2">Benefits</p>

                        </ul>
                    </div>

                    <div className="px-5 pb-5 pt-3">
                        <ul>
                            <p className="text-gray-800 pb-2">FAQ</p>
                            <p className="text-gray-800 pb-2">About us</p>
                        </ul>
                    </div>

                    <div className="px-5 pb-5 pt-3">
                        <ul>
                            <p className="text-gray-800 pb-2">NIBM World Wide</p>
                            <p className="text-gray-800 pb-2">NIBM LMS</p>
                        </ul>
                    </div>

                    <div className="px-5 pb-5 pt-2">
                        <ul>


                            <p className="text-gray-800 pb-4">Subscribe</p>
                            <div className="flex w-56  rounded-[6px] bg-white border border-gray-300">
                                <input type='search' name='search ' placeholder='Get product updates' className='w-full border-none bg-transperant px-2 py-2 text-gray-600 outline-none  text-sm' />
                                <button className='bg-[#0C7E7D] text-white px-4 py-1 rounded-[5px]'><Image src={Logoarrow} alt="ic Arrow Go.png" /></button>

                            </div>
                            <div className='flex gap-3 pt-4'>
                                <Image src={LogoIn} alt="instagram.png" />
                                <Image src={LogoLn} alt="linkdin.png" />
                                <Image src={LogoYT} alt="youtube.png" />


                            </div>
                        </ul>
                    </div>
                </div>
                <div className="h-[1px] w-full bg-gray-600 block my-4"></div>
                <div className='px-4 md:px-6'>
                    <p className="text-gray-800 text-center pb-4 px-6">
                        © {new Date().getFullYear()} Examina. All rights reserved.
                    </p>

                </div>


            </div>



        </footer>


    )
}

export default Footer