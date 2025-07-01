
import CustomersRepository from '@/database/repositories/CustomersRepository'
import React from 'react'

export default async function Home() {
    const repository = new CustomersRepository();
    await repository.findAll("email");
    return (
    <div>page</div>
  )
}
