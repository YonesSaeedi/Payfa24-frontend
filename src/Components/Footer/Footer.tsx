


export default function Header() {
  return (
<footer className="bg-blue-600 text-white px-6 py-10">
 
           
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
  
  
  <div className="flex gap-4">
    <a href="#" className="p-2 rounded-full border border-white hover:bg-white hover:text-blue-600 transition"></a>
    <a href="#" className="p-2 rounded-full border border-white hover:bg-white hover:text-blue-600 transition"></a>
    <a href="#" className="p-2 rounded-full border border-white hover:bg-white hover:text-blue-600 transition"></a>
    <a href="#" className="p-2 rounded-full border border-white hover:bg-white hover:text-blue-600 transition"></a>
  </div>

  <div>
    <img src="./../../../public/images/logo.png" alt="logo" />
  </div>

</div>





<div className="flex justify-center gap-20 px-6">


  <div id="left" className="flex flex-col gap-4 items-start relative mr-[200px]">
    <div>
      <img src="./../../../public/images/footer-mobile.png" alt="footer" />
    </div>
    <div className="flex flex-row gap-2 absolute bottom-2.5">
      <button className="bg-white text-blue-600 rounded-md px-4 py-2 flex items-center gap-2 shadow-md hover:bg-gray-100 transition">
        <img src="" alt="مایکت" className="w-6 h-6" />
        دریافت برنامه از مایکت
      </button>
      <button className="bg-white text-blue-600 rounded-md px-4 py-2 flex items-center gap-2 shadow-md hover:bg-gray-100 transition">
        <img src="" alt="بازار" className="w-6 h-6" />
        دریافت برنامه از بازار
      </button>
    </div>
  </div>

  <div id="right" className="flex flex-col space-y-2 text-center md:text-right">
    <h2 className="text-lg font-semibold mb-2">ارتباط با ما</h2>
    <div className="flex items-center gap-2 justify-center md:justify-end">
      <span>۰۲۱-۱۲۳۴۵۶۷۸۹</span>
    </div>
    <div className="flex items-center gap-2 justify-center md:justify-end">
      <span>PayFarF@gmail.com</span>
    </div>
    <div className="flex items-center gap-2 justify-center md:justify-end">
      <span>آدرس:</span>
      <span>
        میدان شهید بهشتی، خیابان امام خمینی، جنب پارک شورا، شهر اردبیل، استان اردبیل.
      </span>
    </div>
  </div>

</div>


</footer>
  );
};

