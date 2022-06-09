import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BigNumber, providers, Wallet, utils, Contract } from "ethers"
import { FlashbotsBundleProvider, FlashbotsBundleResolution } from './index'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import {
    Form,
    Input,
    Button,
    message,
    Space,
    Switch,
    Radio,
    Select
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { reduceAddress } from "../../utils/index"
const { TextArea } = Input;
const { Option } = Select;

const CHAIN_ID = 5
let provider = new providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli")
let FlashbotsRelayProvider =  new providers.InfuraProvider(CHAIN_ID, "4bda20d7583949e08926de4af7ae344e")
const authSigner = Wallet.createRandom()
// 私钥，多个，本地存储
// rpc，列表
// 合约，
// 方法
// 参数
// 自动gas，自定义gas
// 抢购发起次数
// 间隔
// 


const WalletGroup = styled.div`
    width: 100%;
    display: flex;
`
const RPCGroup = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
`
const InputGroup = styled.div`
    width: 500px;
    display: flex;
    align-items: center;
`
const LogGroup = styled.div`
    width: 500px;
    height: 500px;
    div {
        height: 100%;
    }
    textarea {
        background: #001529;
        color: #FFF
    }
        
`

type WalletType = {
    address: string,
    privateKey: string
}
type ParamType = {
    name: string,
    value: string
}

const FrontendNew: React.FC = () => {
    const [flashBotsLoading, setFlashBotsLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [privateKeyInput, setPrivateKeyInput] = useState("")
    const [blockNumber, setBlockNumber] = useState<number>(1)
    const [blockNumberType, setBlockNumberType] = useState<number>(0)
    const RPCFlashBotsInput = "https://relay-goerli.flashbots.net/";
    const [RPCInput, setRPCInput] = useState<string>("https://rpc.ankr.com/eth_goerli")
    const [walletArr, setWalletArr] = useState<[WalletType]>()
    const [walletActive, setWalletActive] = useState<WalletType>()
    const [contractAddress, setContractAddress] = useState<string>("0x2B14938d69791514D7aDE30Be124aac304249060")
    const [functionType, setFunctionType] = useState<string>("0")
    const [functionString, setFunctionString] = useState<string>("mintNFT")
    const paramValueDefault: ParamType[] = [{ name: "address", value: "0x7543E79DCB3FbBa019eDA84B95a4cE894febcb4b" }, { name: "string", value: "not" }]
    const [paramValue, setParamValue] = useState<ParamType[]>(paramValueDefault)
    const [callDataValue, setCallDataValue] = useState<string>("0xeacabe140000000000000000000000007543e79dcb3fbba019eda84b95a4ce894febcb4b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000036e6f740000000000000000000000000000000000000000000000000000000000")
    const [priorityFee, setPriorityFee] = useState<string>("2")
    const [flashBotsSendNum, setFlashBotsSendNum] = useState<number>(5)
    const [gapTime, setGapTIme] = useState<number>(2)
    const [timer1, setTimer1] = useState<any>()
    const [timer2, setTimer2] = useState<any>()
    const [time1, setTime1] = useState<number>(0)
    const [time2, setTime2] = useState<number>(0)
    const [log, setLog] = useState<string>("")
    // const [maxFee, setMaxFee] = useState<string>("")
    // const [feeAuto, setFeeAuto] = useState<boolean>(true);

    const GWEI = BigNumber.from(10).pow(9)
    const big0 = BigNumber.from(0)


    const first = useCallback(() => {
        //  读取浏览器缓存钱包
        let walletArrStorage: string = localStorage.getItem("FrontendWalletArr") || ""
        if (walletArrStorage) {
            let walletArrCopy: [WalletType] = JSON.parse(walletArrStorage)
            setWalletArr(walletArrCopy)
        }


        let walletActiveStorage: string = localStorage.getItem("FrontendWalletActive") || ""
        if (walletActiveStorage) {
            let walletActiveCopy: WalletType = JSON.parse(walletActiveStorage)
            setWalletActive(walletActiveCopy)
        }

        provider.on('block', async (blockNumber) => {
            setBlockNumber(blockNumber)
        })
        // setInterval(() => {
        //     handleSubmitFlashBots()
        // },5000)
    }, [])
    useEffect(() => {
        first()
    }, [first])


    const handleTimeFlashBots = async () => {
        if(timer1) {
            clearInterval(timer1)
            setTimer1(null)
            setTime1(0)
            return;
        }
        let timer1num:number = gapTime*1000
        let timer = setInterval(()=>{
            timer1num = timer1num - 100;
            setTime1(timer1num / 1000)
            if(timer1num === 0) {
                console.log("发起flashbots")
                handleSubmitFlashBots()
                timer1num = gapTime*1000
            }
        }, 100);
        setTimer1(timer)
        return () => clearInterval(timer1);
    }
    const handleTimeSubmit = async () => {
        if(timer2) {
            clearInterval(timer2)
            setTimer2(null)
            setTime2(0)
            return;
        }
        let timer2num:number = gapTime*1000
        let timer = setInterval(()=>{
            timer2num = timer2num - 100;
            setTime2(timer2num / 1000)
            if(timer2num === 0) {
                console.log("发起普通交易")
                handleSubmit()
                timer2num = gapTime*1000
            }
        }, 100);
        setTimer2(timer)
        return () => clearInterval(timer2);
    }
    // 发起flash bots
    const handleSubmitFlashBots = async () => {
        setFlashBotsLoading(true)

        const wallet = new Wallet(walletActive?.privateKey || '', FlashbotsRelayProvider)
        const flashbotsProvider = await FlashbotsBundleProvider.create(FlashbotsRelayProvider, authSigner, RPCFlashBotsInput)

        let data: string = "";
        if (functionType == "0") {
            let param: string = ""
            let paramValueCopy: any = []
            paramValue?.map((e, i) => {
                if (e.name) {
                    param += e.name + " string" + i + ","
                    paramValueCopy.push(e.value)
                }
            })
            param = param.substring(0, param.length - 1);
            let string = "function " + functionString + "(" + param + ")"

            handlelog(`${string}`)
            handlelog(`${paramValueCopy}`)

            let ABI = [string];
            let iface = new utils.Interface(ABI);
            data = iface.encodeFunctionData(functionString, paramValueCopy)
        } else if (functionType == "1") {
            data = callDataValue;
        }

        let eip1559Transaction: TransactionRequest
        const block = await FlashbotsRelayProvider.getBlock(blockNumber)

        const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas || big0, flashBotsSendNum)
        const PRIORITY_FEE = GWEI.mul(BigNumber.from(priorityFee))
        eip1559Transaction = {
            to: contractAddress,
            type: 2,
            maxFeePerGas: PRIORITY_FEE.add(maxBaseFeeInFutureBlock),
            maxPriorityFeePerGas: PRIORITY_FEE,
            gasLimit: 1000000,
            data: data,
            chainId: CHAIN_ID
        }

        const signedTransactions = await flashbotsProvider.signBundle([
            {
                signer: wallet,
                transaction: eip1559Transaction
            }
        ])

        const targetBlock = blockNumber + flashBotsSendNum

        // 验证
        const simulation = await flashbotsProvider.simulate(signedTransactions, targetBlock)
        // Using TypeScript discrimination
        if ('error' in simulation) {
            handlelog(`Simulation Error.`)
            // console.warn(`Simulation Error: ${simulation.error.message}`)
            // handlelog(`Simulation Error # ${simulation.error.message}`)
            // process.exit(1)
        } else {
            console.log(`Simulation Success: ${JSON.stringify(simulation, null, 2)}`)
            handlelog(`Simulation Success.`)
            // handlelog(`Simulation Success #  ${JSON.stringify(simulation, null, 2)}`)
        }

        for (var i = 1; i <= flashBotsSendNum; i++) {
            let num = blockNumber + i;
            flashbotsProvider.sendRawBundle(
                signedTransactions,
                num
            ).then(async (e: any) => {
                console.log(e)
                const waitResponse = await e.wait()
                console.log(`${num} Wait Response: ${FlashbotsBundleResolution[waitResponse]}`)
                handlelog(`${num} Wait Response: ${FlashbotsBundleResolution[waitResponse]}`)
            });
            console.log("submitted for block # ", num);
            handlelog(`submitted for block # ${num}`)
        }

        // console.log(targetBlock)
        // const bundleSubmission = await flashbotsProvider.sendRawBundle(signedTransactions, targetBlock)

        // console.log('bundle submitted, waiting')
        // if ('error' in bundleSubmission) {
        //     throw new Error(bundleSubmission.error.message)
        // }
        // const waitResponse = await bundleSubmission.wait()
        // console.log(`Wait Response: ${FlashbotsBundleResolution[waitResponse]}`)

        setFlashBotsLoading(false)
    }
    // 发起 普通
    const handleSubmit = async () => {
        setLoading(true)
        let data: string = "";
        if (functionType == "0") {
            let param: string = ""
            let paramValueCopy: any = []
            paramValue?.map((e, i) => {
                if (e.name) {
                    param += e.name + " string" + i + ","
                    paramValueCopy.push(e.value)
                }
            })
            param = param.substring(0, param.length - 1);
            let string = "function " + functionString + "(" + param + ")"

            handlelog(`${string}`)
            handlelog(`${paramValueCopy}`)

            let ABI = [string];
            let iface = new utils.Interface(ABI);
            data = iface.encodeFunctionData(functionString, paramValueCopy)
        } else if (functionType == "1") {
            data = callDataValue;
        }

        const wallet = new Wallet(walletActive?.privateKey || '', provider)
        let nonce = await provider.getTransactionCount(wallet.address)
        const PRIORITY_FEE = GWEI.mul(BigNumber.from(priorityFee))
        let eip1559Transaction:TransactionRequest = {
            to: contractAddress,
            type: 2,
            nonce,
            maxFeePerGas: PRIORITY_FEE.mul(2),
            maxPriorityFeePerGas: PRIORITY_FEE,
            gasLimit: 1000000,
            data: data,
            chainId: CHAIN_ID
        }
        const signedTx = await wallet.signTransaction(eip1559Transaction);
        let tx = await provider.sendTransaction(signedTx);
        const waitResponse = await tx.wait()
        handlelog(`submitted for block # ${waitResponse.blockNumber}`)
        setLoading(false)
    }

    const handleWalletAdd = () => {
        let walletArrStorage: [WalletType] = JSON.parse(JSON.stringify(walletArr || []));
        try {
            new Wallet(privateKeyInput);
        } catch (error) {
            message.error('私钥错误');
            return;
        }
        let wallet = new Wallet(privateKeyInput);

        let walletObj: WalletType = {
            address: wallet.address,
            privateKey: privateKeyInput
        }

        let filter: boolean = true;
        walletArrStorage.map((e: WalletType) => {
            if (e.address == wallet.address) {

                filter = false;
            }
        })
        if (!filter) {
            message.error('地址重复');
            return;
        }
        walletArrStorage.push(walletObj)
        setWalletArr(walletArrStorage)
        localStorage.setItem("FrontendWalletArr", JSON.stringify(walletArrStorage))

    }
    const handleWalletDel = () => {
        let walletArrStorage: [WalletType] = JSON.parse(JSON.stringify(walletArr || []));
        walletArrStorage.map((e: WalletType, i: number) => {
            if (JSON.stringify(walletActive) == JSON.stringify(e)) {
                walletArrStorage.splice(i, 1)
            }
        })
        setWalletArr(walletArrStorage)
        localStorage.setItem("FrontendWalletArr", JSON.stringify(walletArrStorage))
    }
    const handleChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setPrivateKeyInput(e.currentTarget.value)
        },
        [setPrivateKeyInput],
    )
    const handleBlockNumberType = useCallback(
        (e: number) => {
            console.log(e)
            if (e == 0) {
                // 自动获取blocknumber
                provider = new providers.JsonRpcProvider(RPCInput)
                provider.on('block', async (blockNumber) => {
                    console.log(blockNumber)
                    setBlockNumber(blockNumber)
                })
            } else if (e == 1) {
                // 停止自动获取
                provider.off('block')
            }
            setBlockNumberType(e)
        },
        [setBlockNumberType],
    )
    const handleFunctionType = useCallback(
        (e: RadioChangeEvent) => {
            setFunctionType(e.target.value)
        },
        [setFunctionType],
    )
    const walletChange = useCallback(
        (e: WalletType) => {
            setWalletActive(e)
            setPrivateKeyInput(e.privateKey)
            localStorage.setItem("FrontendWalletActive", JSON.stringify(e))
            message.success('当前选中钱包: '+e.address);
        },
        [setWalletActive],
    )
    const handleRPCInput = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setRPCInput(e.currentTarget.value)
        },
        [setRPCInput],
    )
    const handleContractAddressChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setContractAddress(e.currentTarget.value)
        },
        [setContractAddress],
    )
    const handlefunctionStringChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setFunctionString(e.currentTarget.value)
        },
        [setFunctionString],
    )
    const handleCallDataValue = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCallDataValue(e.currentTarget.value)
        },
        [setCallDataValue],
    )
    const handleParamAdd = () => {
        let copy = JSON.parse(JSON.stringify(paramValue || []));
        let obj: ParamType = {
            name: '',
            value: ''
        }
        copy.push(obj)
        setParamValue(copy)

    }
    const handleFlashBotsSendNum = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setFlashBotsSendNum(Number(e.currentTarget.value))
        },
        [setFlashBotsSendNum],
    )
    const handleParamRemove = (num: number) => {
        let copy = JSON.parse(JSON.stringify(paramValue || []));
        copy.splice(num, 1);
        setParamValue(copy)
    }
    const handleParamChange = (key: string, num: number, dom: React.FormEvent<HTMLInputElement>) => {

        let copy = JSON.parse(JSON.stringify(paramValue || []));
        copy.map((e: any, i: number) => {
            if (i === num) {
                e[key] = dom.currentTarget.value
            }
        })
        setParamValue(copy)
    }
    const priorityFeeChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setPriorityFee(e.currentTarget.value)
        },
        [setPriorityFee],
    )
    const handleGapTime = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setGapTIme(Number(e.currentTarget.value))
        },
        [setGapTIme],
    )

    // const maxFeeChange = useCallback(
    //     (e: React.FormEvent<HTMLInputElement>) => {
    //         setMaxFee(e.currentTarget.value)
    //     },
    //     [setMaxFee],
    // )
    // const handleFeeAuto = () => {
    //     setFeeAuto(!feeAuto)
    // }

    const handlelog = (e: string) => {
        setLog((log) => (e + '\n' + log))
    }
    return (
        <>
            <InputGroup>
                <div style={{ width: '100px' }}>账户</div>
                <div style={{ width: '100%' }}>
                    {walletArr && walletArr.map((e, i) => (
                        <Button
                            onClick={() => walletChange(e)}
                            key={i}
                            type={JSON.stringify(walletActive) == JSON.stringify(e) ? "primary" : undefined}>
                            {reduceAddress(e.address)}
                        </Button>
                    ))}
                </div>
            </InputGroup>
            <br />
            <InputGroup>
                <div style={{ width: '100px' }}>账户操作</div>
                <Input.Group compact style={{ width: '100%', display: 'flex' }}>
                    <Input
                        placeholder="私钥"
                        style={{ width: '100%' }}
                        value={privateKeyInput}
                        onChange={handleChange} />
                    <Button type="primary" onClick={handleWalletAdd}>Add</Button>
                    <Button type="primary" danger onClick={handleWalletDel}>Del</Button>
                </Input.Group>
            </InputGroup>
            <br />
            <InputGroup>
                <div style={{ width: '100px' }}>Flash Bots</div>
                <div style={{ width: '100%', color: "#ff4d4f", fontWeight: "bold" }}>{RPCFlashBotsInput}</div>
            </InputGroup>
            <br />
            <InputGroup>
                <div style={{ width: '100px' }}>RPC</div>
                <Input value={RPCInput} size="large" onChange={handleRPCInput} />
            </InputGroup>
            <br />
            <InputGroup>
                <div style={{ width: '100px' }}>区块号</div>
                <Input.Group style={{ width: '100%', display: 'flex' }}>
                    <Select value={blockNumberType} size="large" onChange={handleBlockNumberType}>
                        <Option value={0}>自动请求</Option>
                        <Option value={1}>手动输入</Option>
                    </Select>
                    <Input placeholder="" size="large" value={blockNumber} />
                </Input.Group>

            </InputGroup>
            <br />
            <InputGroup>
                <div style={{ width: '100px' }}>合约地址</div>
                <Input placeholder="0x" size="large" value={contractAddress} onChange={handleContractAddressChange} />
            </InputGroup>
            <br />
            <InputGroup>
                <div style={{ width: '100px' }}>数据类型</div>
                <Radio.Group style={{ width: '100%' }} defaultValue="a" buttonStyle="solid" value={functionType} onChange={handleFunctionType}>
                    <Radio.Button style={{ width: '50%' }} value="0">Function</Radio.Button>
                    <Radio.Button style={{ width: '50%' }} value="1">CallData</Radio.Button>
                </Radio.Group>
            </InputGroup>
            <br />
            {
                functionType == "0" &&
                <>
                    <InputGroup>
                        <div style={{ width: '100px' }}>方法</div>
                        <Input placeholder="mint" size="large" value={functionString} onChange={handlefunctionStringChange} />
                    </InputGroup>
                    <br />
                    <InputGroup>
                        <div style={{ width: '100px' }}>参数组</div>
                        <div style={{ width: '100%' }}>
                            {paramValue && paramValue.map((e, i) => (
                                <Space key={i} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Input placeholder="参数类型" value={e.name} onChange={(dom) => handleParamChange('name', i, dom)} />
                                    <Input placeholder="值" value={e.value} onChange={(dom) => handleParamChange('value', i, dom)} />
                                    <MinusCircleOutlined onClick={() => handleParamRemove(i)} />
                                </Space>
                            ))}
                            <Button type="primary" size="large" style={{ width: '100%' }} onClick={handleParamAdd} icon={<PlusOutlined />}></Button>

                        </div>
                    </InputGroup>
                </>
            }
            {
                functionType == "1" &&
                <>
                    <InputGroup>
                        <div style={{ width: '100px' }}>CallData</div>
                        <TextArea style={{ height: '200px' }} placeholder="0x" size="large" value={callDataValue} onChange={handleCallDataValue} />
                    </InputGroup>
                </>
            }
            <br />
            {/* <InputGroup>
                <div style={{ width: '100px' }}>Auto</div>
                <Switch checked={feeAuto} onChange={handleFeeAuto} />
            </InputGroup>
            <br /> */}
            <InputGroup>
                <div style={{ width: '100px' }}>Priority fee</div>
                <Input placeholder="price" size="large" value={priorityFee} onChange={priorityFeeChange} suffix="GWEI" />
            </InputGroup>
            <br />
            <InputGroup>
                <div style={{ width: '100px' }}>FlashBots </div>
                <Input placeholder="price" size="large" value={flashBotsSendNum} onChange={handleFlashBotsSendNum} suffix="次" />
            </InputGroup>
            <br />
            {/* <InputGroup>
                <div style={{ width: '100px' }}>Max fee</div>
                <Input placeholder="price" size="large" value={maxFee} onChange={maxFeeChange} suffix="GWEI" />
            </InputGroup>
            <br /> */}
            <InputGroup>
                <Button type="primary" style={{ width: '100%' }} onClick={handleSubmitFlashBots} loading={flashBotsLoading}>发起一次FlashBots</Button>
                <Button type="primary" style={{ width: '100%', marginLeft: '20px' }} onClick={handleSubmit} loading={loading}>发起一次普通交易</Button>
            </InputGroup>
            <br /> <br /> <br />
            <InputGroup>
                <div style={{ width: '100px' }}>循环间隔</div>
                <Input placeholder="" size="large" value={gapTime} onChange={handleGapTime} suffix="秒" />
            </InputGroup>
            <br />
            <InputGroup>
                <Button type="default" style={{ width: '100%' }} onClick={handleTimeFlashBots} >{timer1 ? "点击取消" : "发起FlashBots"} {time1 !== 0 && time1}</Button>
                <Button type="default" style={{ width: '100%', marginLeft: '20px' }} onClick={handleTimeSubmit} >{timer2 ? "点击取消" : "发起普通交易"}  {time2 !== 0 && time2}</Button>
            </InputGroup>
            <br />
            日志
            <LogGroup>
                <TextArea showCount value={log} />
            </LogGroup>
        </>
    )
}
export default FrontendNew