import cron from 'node-cron'
import { weeklyStatusUpdate } from '../handlers/bot'

// const WEEKLY_STATUS_UPDATE_CRON_INTERVAL = '0 8 * * 1' // every Monday at 8 AM
const WEEKLY_STATUS_UPDATE_CRON_INTERVAL = '*/2 * * * *'

const startWeeklyStatusUpdateJob = () => {
    cron.schedule(WEEKLY_STATUS_UPDATE_CRON_INTERVAL, async function() {
        weeklyStatusUpdate()
    })
}

export {
    startWeeklyStatusUpdateJob,
}
