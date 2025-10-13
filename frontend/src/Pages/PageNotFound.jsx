import React from 'react'
import pagenotfound from '../assets/pagenotfound.png'
const PageNotFound = () => {
  return (
 <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-16 lg:px-8 font-poppins ">
  <div class="text-center">
    <img class="mx-auto h-52 w-56" src={pagenotfound} alt="Page Not Found"/>
    <p class="text-base font-semibold text-[#2D68F6] bg-[#E4F0FF] w-fit mx-auto py-1 px-3 rounded-lg">404 error</p>
    <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">We've lost this page</h1>
    <p class="mt-6 text-lg font-medium text-pretty text-[#7E7E7E] sm:text-xl/8">Sorry,the page you are looking for doesn't exist or has been moved.</p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a href="/" class="rounded-md bg-[#2D68F6] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back home</a>
     
    </div>
  </div>
</main>

  )
}

export default PageNotFound