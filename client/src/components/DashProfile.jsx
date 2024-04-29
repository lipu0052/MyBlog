import React from 'react'
import {TextInput , Button} from 'flowbite-react'

const DashProfile = ({user}) => {

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='text-center text-2xl font-semibold my-3'>PROFILE</h1>
        <from className="flex gap-3 flex-col ">
          <div className=" w-25 h-25 self-center cursor-pointer">
            <img src={user.profileImg} alt="profile" className="rounded-full object-cover border-8 w-full h-full" />
          </div>
          <TextInput label="Name"  value={user.name} />
          <TextInput label="Email" value={user.email} />
          <TextInput label="Password" placeholder='password' />
          <Button type="submit" gradientDuoTone='greenToBlue'  outline className="w-full">
            Update
          </Button>
        </from>
        <div className="mt-2 flex justify-between">
          <span className="text-sm cursor-pointer text-red-600">
            Delete Account
          </span>
          <span className="text-sm cursor-pointer text-red-600">
            Logout
          </span>
        </div>
    

    </div>
  )
}

export default DashProfile