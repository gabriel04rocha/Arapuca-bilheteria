'use client'

import { authClient } from "@/src/lib/auth-client";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import axios from "axios"
import { useEffect, useState } from "react";

export default function guestListPage () {

    const [userEmail, setUserEmail] = useState('');

    const [guests, setGuests] = useState([])

    async function getSession() {
        const { data: session } = await authClient.getSession()

        if (!session) {
            window.location.replace("/login")
        } else {
            setUserEmail(session.user.name)
        }
    }

    getSession()
    
    useEffect(() => { 

        async function loadGuests () {
            const tickets = await axios.get(`{${process.env.NEXT_PUBLIC_API_URL}/api/confirmed-guests`);

            setGuests(tickets.data);
        }


        loadGuests()
    }, [])


    return (
        <>
            <div className="bg-white/20 w-full h-[50px] flex flex-row justify-between items-center p-7">
                <span>{userEmail}</span>
                <button onClick={async () => {
                    await authClient.signOut()
                    window.location.reload()
                    }} className="text-black hover:text-white bg-white transition hover:bg-black p-2 rounded-sm">Deslogar</button>
            </div>
            <div className="hero flex flex-col justify-center items-center w-[90%] m-auto gap-10">
                <div className="flex justify-center items-center w-[70%]">
                    <img src="/logo.png" alt="Arapuca" />
                </div>
                <div>
                    <h1 className="text-[40px]">Lista de convidados</h1>
                </div>
                <div className="w-full">
                    <Table>
                        <TableCaption>lista de convidados confirmados da Arapuca</TableCaption>
                        <TableHeader className="text-[14px]">
                            <TableRow className="bg-white/20 rounded-lg">
                                <TableHead className="text-white">ID</TableHead>
                                <TableHead className="text-white">Nome</TableHead>
                                <TableHead className="text-white">E-mail</TableHead>
                                <TableHead className="text-white">Telefone</TableHead>
                                <TableHead className="text-white">CPF</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[16px]">
                            {guests.map((item) => {
                                return (<TableRow key={item.id}>
                                    <TableCell className="text-left">{item.id}</TableCell>
                                    <TableCell className="text-left">{item.ticketName}</TableCell>
                                    <TableCell className="text-left">{item.ticketEmail}</TableCell>
                                    <TableCell className="text-left">{item.ticketPhoneNumber.replace(/^([1-9]{2})(9\d{4})(\d{4})$/, "($1) $2-$3")}</TableCell>
                                    <TableCell className="text-left">{item.ticketCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</TableCell>
                                </TableRow>)
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}