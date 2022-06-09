import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BigNumber, providers, Wallet, utils, Contract } from "ethers"
import { TransactionRequest } from '@ethersproject/abstract-provider'
import {
    Form,
    Input,
    Button,
    message,
    Space,
    Switch,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const InputGroup = styled.div`
    width: 500px;
    display: flex;
    align-items: center;
`

const List: React.FC = () => {
    const [RPCInput, setRPCInput] = useState<string>("https://relay-goerli.flashbots.net/")
    const handleRPCInput = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setRPCInput(e.currentTarget.value)
        },
        [setRPCInput],
    )
    return (
        <>
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
        </>
    )
}
export default List