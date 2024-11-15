import { Filename, LogTarget, Name, saveLog, scriptSettings, time } from "@sagittal/general"
import { Metric } from "../bestMetric"
import { DEFAULT_MAX_UNIT_WHEN_PERFECTING } from "../constants"
import { popularityMetricLfcScriptGroupSettings } from "../globals"
import { perfectMetrics, perfectMetricsSync } from "../perfecter"
import { formatBestMetrics } from "../solver"
import { applySharedPopularityMetricLfcScriptSetup, load } from "./shared"

const defaultLogTargets = [LogTarget.SETUP, LogTarget.PROGRESS, LogTarget.RESULT, LogTarget.FINAL]
applySharedPopularityMetricLfcScriptSetup({ logDir: "perfectMetrics" as Filename, defaultLogTargets })

popularityMetricLfcScriptGroupSettings.maxUnit = DEFAULT_MAX_UNIT_WHEN_PERFECTING

const bestMetricsToBePerfected = load("metrics" as Filename) as Record<Name<Metric>, Metric>

const finalOutput = (): void => {
    saveLog(`\n\nTHE PERFECTED METRICS ARE ${formatBestMetrics()}`, LogTarget.FINAL)

    if (scriptSettings.time) saveLog(`\n\nPERFECTING METRICS TOOK ${time()}`, LogTarget.FINAL)
    saveLog(`MAX UNIT ${popularityMetricLfcScriptGroupSettings.maxUnit}`, LogTarget.FINAL)
    saveLog(`Z ${popularityMetricLfcScriptGroupSettings.z}`, LogTarget.FINAL)
    saveLog(`ONLY TOP ${popularityMetricLfcScriptGroupSettings.onlyTop}`, LogTarget.FINAL)
}

if (popularityMetricLfcScriptGroupSettings.sync) {
    perfectMetricsSync(Object.values(bestMetricsToBePerfected))
    finalOutput()
} else {
    void perfectMetrics(Object.values(bestMetricsToBePerfected)).then((): void => {
        finalOutput()
    })
}
