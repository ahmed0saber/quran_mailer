const startMeasuringTime = () => {
    const processStartTime = process.hrtime.bigint()

    return () => {
        return (process.hrtime.bigint() - processStartTime) / BigInt(1e6)
    }
}

export { startMeasuringTime }
