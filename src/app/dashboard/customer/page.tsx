import { Container } from '@/components/container';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CardCustomer } from './components/card'
import prismaClient from "@/lib/prisma"
import { Customer as CustomerType } from '@prisma/client'


export default async function Customer(){
    const session = await getServerSession(authOptions);
      if(!session || !session.user){
        redirect("/");
      }
      const customers: CustomerType[]  = await prismaClient.customer.findMany({
        where: {
            userId: session.user.id
        }
      })
//      console.log(customers);
    return (
        <Container>
            <main className='mt-9 mb-2'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-3xl font-bold'>Meus Clientes</h1>
                    <Link href="/dashboard/customer/new" className='bg-blue-500 text-white px-4 py-1 rounded'>Novo Cliente</Link>
                </div>
                <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2'>
                    {customers.map( customer => (
                         <CardCustomer 
                            key={customer.id}
                            customer={customer}
                         />
                    ))}
                </section>
                {customers.length === 0 && (
                    <h1 className='text-gray-600'>Você ainda não possui nenhum cliente</h1>
                )}
            </main>
        </Container>
    )
}