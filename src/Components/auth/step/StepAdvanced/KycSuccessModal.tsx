import IconVerify from '../../../../assets/icons/authentication/IconVerify'

const KycSuccessModal = () => {
  return (
    <div onClick={closeSuccessModalAndCallNext} className="fixed cursor-pointer inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="lg:w-[448px] w-full lg:rounded-2xl rounded-xl lg:p-8 p-4 relative bg-white8 text-center" onClick={(e) => e.stopPropagation()}>
        <span className="icon-wrapper w-16 h-16 mx-auto text-blue1"><IconVerify /></span>
        <p className="text-xl font-bold mt-4 mb-8 text-black0">! احراز هویت شما باموفقیت انجام شد</p>
        <button
          type="button"
          onClick={closeSuccessModalAndCallNext}
          className="mt-2 text-lg font-bold bg-blue1 w-full h-[56px] rounded-lg text-white2"
        >
          متوجه شدم
        </button>
      </div>
    </div>
  )
}

export default KycSuccessModal