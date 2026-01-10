// submit.js

import { BiRocket } from 'react-icons/bi';

export const SubmitButton = () => {

    return (
        <div className="fixed bottom-8 right-8 z-10">
            <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
                <BiRocket className="text-xl" />
                <span>Submit Pipeline</span>
            </button>
        </div>
    );
}
