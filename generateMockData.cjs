const falso = require("@ngneat/falso");

const API = "http://localhost:9000"

const FARM_ID = "65f366b85939376b5823e03e"
const headers = {
  Authorization:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjM2NmUxNTkzOTM3NmI1ODIzZTA0NCIsIm5hbWUiOiJXb25ueW8gSGFtZXN0ZXIiLCJlbWFpbCI6InRlc3RAdGVzdGluZy5jb20iLCJmYXJtIjp7Il9pZCI6IjY1ZjM2NmI4NTkzOTM3NmI1ODIzZTAzZSIsIm5hbWUiOiJNciBHcmVlbidzIEZhcm0iLCJhZGRyZXNzIjoiQ2FuYWRhIiwiaXNEaXNhYmxlZCI6ZmFsc2V9LCJpYXQiOjE3MTA0NTA0MjEsImV4cCI6MTcxMDQ1NDAyMX0.EEFYi8YBbagekOjBg6ibB8j4wPAtXxTV4Sv8k_FWTIk",
}

const RUN_PICKERS = false
const RUN_DEDUCTIONS = false
const RUN_PRODUCTS = false
const RUN_CURRENCIES = false
const RUN_UNITS = false

const RUN_HARVEST_LOGS = true
const SEASON_START_DATE = "2023 08 01"
const HARVEST_LOGS_START_DATE = "2023 08 01"

// const API = "https://y2457icv5c.execute-api.us-west-2.amazonaws.com/dev";

const bloodTypes = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
]

const relationships = ["FAMILY", "FRIEND", "COLLEAGUE", "OTHER"]

const timeframes = ["WEEKLY", "BIWEEKLY", "MONTHLY"]

const seasonStatuses = ["ACTIVE", "CLOSED"]

// Function to generate a random date within a given range
const getRandomDate = (from, to) => {
  return falso.randBetweenDate({ from, to }).getTime()
}

// Function to generate a picker object
const generatePicker = () => {
  return {
    name: falso.randFullName(),
    phone: falso.randPhoneNumber(),
    emergencyContact: {
      name: falso.randFullName(),
      phone: falso.randPhoneNumber(),
      relationship: falso.rand(relationships),
    },
    govId: falso.randSwift(),
    address: falso.randStreetAddress(),
    bloodType: falso.rand(bloodTypes),
    score: falso.randNumber({ min: 0, max: 100 }),
    employment: {
      startDate: getRandomDate(new Date(2022, 0, 1), new Date()),
      endDate: null,
    },
  }
}

const createPickers = async () => {
  try {
    // Get all pickers
    const getPickersResponse = await fetch(`${API}/api/v1/pickers`, {
      headers,
    }).then((response) => response.json())
    console.log("----")
    console.log(`${getPickersResponse?.data?.length} Pickers found `)
    console.log("----\n")

    if (!getPickersResponse?.data?.length) {
      // Generate a list of picker objects
      const pickerList = Array.from({ length: 20 }, () => generatePicker())

      Promise.all(
        pickerList.map((picker) =>
          fetch(`${API}/api/v1/pickers`, {
            method: "POST",
            body: JSON.stringify(picker),
            headers: {
              "Content-Type": "application/json",
              ...headers,
            },
          })
        )
      )
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((createPickersResponses) => {
          console.log({ createPickersResponses })
          const success = createPickersResponses.filter(
            ({ data }) => !!data
          ).length
          const fail = createPickersResponses.filter(({ data }) => !data).length
          console.log("----")
          console.log(
            `Pickers creation finished. Success: ${success}. Fail:${fail} `
          )
          console.log("----\n")
        })
    }
  } catch (error) {
    console.log({ error })
  }
}

if (RUN_PICKERS) {
  createPickers()
}

// DEDUCTIONS
if (RUN_DEDUCTIONS) {
  const generateDeductions = () => {
    return {
      name: falso.randJobArea(),
    }
  }

  const deductionsList = Array.from({ length: 3 }, () => generateDeductions())

  Promise.all(
    deductionsList.map((deduction) =>
      fetch(`${API}/api/v1/deductions`, {
        method: "POST",
        body: JSON.stringify(deduction),
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      })
    )
  )
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((responses) => {
      const success = responses.filter(({ error }) => !error).length
      const fail = responses.filter(({ error }) => !!error).length
      console.log("----")
      console.log(
        `Deduction creation finished. Success: ${success}. Fail:${fail} `
      )
      console.log("----\n")
    })
}

// PRODUCTS
if (RUN_PRODUCTS) {
  const generateProducts = () => {
    return {
      name: falso.randFood(),
    }
  }
  const productsList = Array.from({ length: 5 }, () => generateProducts())

  Promise.all(
    productsList.map((product) =>
      fetch(`${API}/api/v1/products`, {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      })
    )
  )
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((responses) => {
      const success = responses.filter(({ error }) => !error).length
      const fail = responses.filter(({ error }) => !!error).length
      console.log("----")
      console.log(
        `Product creation finished. Success: ${success}. Fail:${fail} `
      )
      console.log("----\n")
    })
}

// CURRENCY;

if (RUN_CURRENCIES) {
  Promise.all(
    [{ name: "USD$" }].map((data) =>
      fetch(`${API}/api/v1/currencies`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      })
    )
  )
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((responses) => {
      const success = responses.filter(({ error }) => !error).length
      const fail = responses.filter(({ error }) => !!error).length
      console.log("----")
      console.log(
        `Currency creation finished. Success: ${success}. Fail:${fail} `
      )
      console.log("----\n")
    })
}

// UNIT;

if (RUN_UNITS) {
  Promise.all(
    [{ name: "kg" }].map((data) =>
      fetch(`${API}/api/v1/units`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      })
    )
  )
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((responses) => {
      const success = responses.filter(({ error }) => !error).length
      const fail = responses.filter(({ error }) => !!error).length
      console.log("----")
      console.log(`Unit creation finished. Success: ${success}. Fail:${fail} `)
      console.log("----\n")
    })
}

// SEASON;

const generateSeasons = ({
  farmId,
  productId,
  unitId,
  currencyId,
  deductions,
}) => {
  return {
    name: `${falso.randMonth()} - ${falso.randCat()}`,
    startDate: new Date(SEASON_START_DATE).getTime(),
    payrollTimeframe: "BIWEEKLY",
    price: falso.randFloat({ min: 5, max: 15 }),
    farmId,
    productId,
    unitId,
    currencyId,
    deductions: deductions.map(({ _id }) => {
      return {
        deductionID: _id,
        price: falso.randFloat({ min: 1, max: 5, fraction: 2 }),
      }
    }),
  }
}

const createSeason = async () => {
  // Get all seasons
  const getSeasonsResponse = await fetch(`${API}/api/v1/seasons`, {
    headers,
  }).then((response) => response.json())
  console.log("----")
  console.log(`${getSeasonsResponse?.data?.length} Seasons found `)
  console.log("----\n")

  console.log({ getSeasonsResponse })
  if (!!getSeasonsResponse?.data?.length) {
    return getSeasonsResponse?.data?.[0]
  }

  const {
    data: [product],
  } = await fetch(`${API}/api/v1/products`, { headers }).then((response) =>
    response.json()
  )

  const {
    data: [unit],
  } = await fetch(`${API}/api/v1/units`, { headers }).then((response) =>
    response.json()
  )

  const {
    data: [currency],
  } = await fetch(`${API}/api/v1/currencies`, { headers }).then((response) =>
    response.json()
  )

  const { data: deductions } = await fetch(`${API}/api/v1/deductions`, {
    headers,
  }).then((response) => response.json())

  const seasonsList = Array.from({ length: 1 }, () =>
    generateSeasons({
      farmId: FARM_ID,
      currencyId: currency._id,
      productId: product._id,
      unitId: unit,
      deductions,
      price: falso.randNumber({ min: 10, max: 20 }),
    })
  )

  const seasons = await Promise.all(
    seasonsList.map((data) =>
      fetch(`${API}/api/v1/seasons`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      })
    )
  ).then((responses) => Promise.all(responses.map((res) => res.json())))

  console.log({ seasons })
  const success = seasons.filter(({ error }) => !error).length
  const fail = seasons.filter(({ error }) => !!error).length
  console.log("----")
  console.log(`Season creation finished. Success: ${success}. Fail:${fail} `)
  console.log("----\n")

  return seasons.data?.[0]
}

// HARVEST LOGS
const generateHarvestLogs = ({
  seasonId,
  pickerId,
  seasonDeductionIds,
  createdAt,
}) => {
  return {
    seasonId,
    pickerId,
    collectedAmount: falso.randNumber({ min: 1, max: 10, fraction: 0 }),
    seasonDeductionIds,
    notes: falso.randPhrase(),
    createdAt,
  }
}

const createHarvestLogs = async () => {
  try {
    const seasonCreated = await createSeason()

    console.log({ season: seasonCreated })

    // Get all pickers
    const { data: pickers } = await fetch(`${API}/api/v1/pickers`, {
      headers,
    }).then((response) => response.json())

    let harvesLogs = []
    if (Array.isArray(pickers) && pickers.length) {
      for (let i = 0; i < 8; i++) {
        const picker = pickers?.[i]

        if (picker && seasonCreated) {
          const harvestLogListPerPicker = Array.from(
            { length: 30 },
            (_, index) => {
              const seasonStartDate = new Date(HARVEST_LOGS_START_DATE)

              seasonStartDate.setDate(seasonStartDate.getDate() + index)

              return generateHarvestLogs({
                createdAt: seasonStartDate.getTime(),
                pickerId: picker._id,
                seasonId: seasonCreated._id,
                seasonDeductionIds: falso.rand(
                  seasonCreated.deductions.map((de) => de?.deductionID)
                ),
              })
            }
          )

          // console.log({ harvestLogListPerPicker });
          harvesLogs = [...harvesLogs, ...harvestLogListPerPicker]
        }
      }
    }

    console.log(harvesLogs.length)
    console.log(harvesLogs[0])

    if (harvesLogs.length) {
      const hLogs = await Promise.all(
        harvesLogs.map((data) =>
          fetch(`${API}/api/v1/harvest-logs`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              ...headers,
            },
          })
        )
      ).then((responses) => Promise.all(responses.map((res) => res.json())))

      // console.log({ hLogs })
      const hSuccess = hLogs.filter(({ error }) => !error).length
      const hFail = hLogs.filter(({ error }) => !!error).length
      console.log("----")
      console.log(
        `Harvest Log creation finished. Success: ${hSuccess}. Fail:${hFail} `
      )
      console.log("----\n")
    }
  } catch (error) {
    console.log({ error })
  }
}

if (RUN_HARVEST_LOGS) {
  createHarvestLogs()
}
