import React, { useState } from 'react';

const ViewExamRoom = () => {
  const [symbolNumber, setSymbolNumber] = useState('');
  const [collegeName, setCollegeName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted:\nSymbol Number: ${symbolNumber}\nCollege Name: ${collegeName}`);
  };

  return (
    <div className='max-w-[800px] mx-auto px-4 py-10'>
      <h2 className='text-4xl font-bold text-center mb-6'>See your Exam Detail</h2>

      {/* Form section */}
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-4 mb-5'>

        {/* Inputs row */}
        <div className='flex flex-col md:flex-row gap-4 w-full justify-center'>
          <input
            type='text'
            placeholder='Enter Symbol Number...'
            value={symbolNumber}
            onChange={(e) => setSymbolNumber(e.target.value)}
            className='px-4 py-2 border rounded-full w-full md:w-[300px]'
            required
          />
          <input
            type='text'
            placeholder='Enter College Name...'
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            className='px-4 py-2 border rounded-full w-full md:w-[300px]'
            required
          />
        </div>

        {/* Submit button on next line, centered */}
        <button
          type='submit'
          className='bg-green-500 text-white text-bold text-[20px] font-semibold px-6 py-2 rounded-xl hover:bg-green-600 transition mt-2'
        >
          Submit
        </button>
      </form>

      {/* Instructions section */}
      <div>
        <h3 className='text-3xl font-bold text-center mb-4'>
          Important Instructions for Examinees
        </h3>
        <ul className='list-decimal list-inside space-y-3 text-justify text-[20px]'>
          <li>Candidates must sit in their designated seat according to the seat plan prepared by the exam center.</li>
          <li>Candidates arriving more than 30 minutes late will not be allowed to enter the exam hall.</li>
          <li>Mobile phones are not allowed inside the examination hall.</li>
          <li>Candidates may not leave their seat or the exam hall within one hour of the exam start without permission from the supervisor.</li>
          <li>All candidates must be present on the scheduled exam day without fail.</li>
          <li>Candidates are not allowed to bring any books, notes, or cheat materials into the exam hall. Prohibited items may be confiscated.</li>
          <li>Candidates are not allowed to talk among themselves during the exam or write anything other than answers on the paper.</li>
          <li>If a candidate copies or assists another, both candidates may be disqualified.</li>
          <li>Answer sheets will only be accepted if submitted with the invigilator’s approval.</li>
          <li>Candidates must submit their answer sheets before leaving the examination hall.</li>
        </ul>
      </div>
    </div>
  );
};

export default ViewExamRoom;
