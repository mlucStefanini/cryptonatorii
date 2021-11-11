import { PeriodicRunner } from './js/runner.js'

new PeriodicRunner(process.env.DEBUG == "true").start();