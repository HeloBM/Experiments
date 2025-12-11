
import * as fs from "fs"
import * as yaml from "yaml"
import * as path from 'path'

import { performance } from 'perf_hooks'

import * as jsonPermissions from './jsonPermissions.json'

const filepath = './yamlPermissions.yaml'
const yamlString = fs.readFileSync(filepath, 'utf8')
const yamlPermissions = yaml.parse(yamlString)

enum Methods {
    "current_method",
    "json_id_route",
    "json_route_id",
    "json_role_route",
    "json_route_role",
    "yaml_id_route",
    "yaml_route_id",
    "yaml_role_route",
    "yaml_route_role"
}

enum CustomerRoleId {
    admin = 1,
    dataScientist = 2,
    viewer = 3
}

class Customer {
    customerRoleId: CustomerRoleId

    constructor(customerRoleId: CustomerRoleId) {
        this.customerRoleId = customerRoleId
    }
}

class JSONCustomer {
    customerRoleId: CustomerRoleId

    constructor(customerRoleId: CustomerRoleId) {
        this.customerRoleId = customerRoleId
    }
}

const customer = new Customer(CustomerRoleId.admin)
const newCustomer = new JSONCustomer(CustomerRoleId.dataScientist)

const numExecutions = 1000
const numMethods = Object.keys(Methods).filter(key => isNaN(Number(key))).length;

const startTime: number[] = new Array(numMethods).fill(0)
const endTime: number[] = new Array(numMethods).fill(0)
const executionTime: number[] = new Array(numMethods).fill(0)
let mockVariable = 0

for (let i = 0; i < numExecutions; i++) {
    // ATUAL
    startTime[0] = performance.now()
    if (customer.customerRoleId === CustomerRoleId.admin)
        mockVariable = 1
    endTime[0] = performance.now()
    executionTime[0] += endTime[0] - startTime[0]

    // JSON
    startTime[1] = performance.now()
    if (jsonPermissions.backendById[newCustomer.customerRoleId].createRoute)
        mockVariable = 1
    endTime[1] = performance.now()
    executionTime[1] += endTime[1] - startTime[1]

    startTime[2] = performance.now()
        mockVariable = 1
    endTime[2] = performance.now()
    executionTime[2] += endTime[2] - startTime[2]

    startTime[3] = performance.now()
    if (jsonPermissions.backendByRole[CustomerRoleId[newCustomer.customerRoleId]].createRoute)
        mockVariable = 1
    endTime[3] = performance.now()
    executionTime[3] += endTime[3] - startTime[3]

    startTime[4] = performance.now()
    if (jsonPermissions.backendRouteByRole.createRoute[CustomerRoleId[newCustomer.customerRoleId]])
        mockVariable = 1
    endTime[4] = performance.now()
    executionTime[4] += endTime[4] - startTime[4]

    // YML
    startTime[5] = performance.now()
    if (yamlPermissions.backendById[newCustomer.customerRoleId].createRoute)
        mockVariable = 1
    endTime[5] = performance.now()
    executionTime[5] += endTime[5] - startTime[5]

    startTime[6] = performance.now()
    if (yamlPermissions.backendRouteById.createRoute[newCustomer.customerRoleId])
        mockVariable = 1
    endTime[6] = performance.now()
    executionTime[6] += endTime[6] - startTime[6]

    startTime[7] = performance.now()
    if (yamlPermissions.backendByRole[CustomerRoleId[newCustomer.customerRoleId]].createRoute)
        mockVariable = 1
    endTime[7] = performance.now()
    executionTime[7] += endTime[7] - startTime[7]

    startTime[8] = performance.now()
    if (yamlPermissions.backendRouteByRole.createRoute[CustomerRoleId[newCustomer.customerRoleId]])
        mockVariable = 1
    endTime[8] = performance.now()
    executionTime[8] += endTime[8] - startTime[8]
}

const rows = []

for (let i = 0; i < numMethods; i++) {
    executionTime[i] = executionTime[i] / numExecutions
    console.log(`${Methods[i]}\t:\t${executionTime[i].toFixed(10)} ms`)
    rows[i] = [Methods[i], executionTime[i].toFixed(10)]
}

const header = ["method", "execution_time"]
const csvStr = [header, ...rows].join('\n')
const csvPath = path.join(__dirname, "execution_time.csv")

try {
    fs.writeFileSync(csvPath, csvStr, 'utf-8')
} catch (err) {
    console.error("Erro ao escrever o arquivo CSV: ", err)
}