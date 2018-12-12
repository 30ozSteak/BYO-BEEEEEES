# BYOBEEEEEEE

## API-ary for bees :bee:

### Table of Contents

- Locations
- Bees

## Bees

- GET all bees by their location - /api/v1/locations
  Hitting this point will return an array of all bees in the DB, by location
- Example Response

  ````name: "Angola",
    abbr: "AO",
    count: 127,
    bees: [
      {
        name: "Euaspis abdominalis",
        desc: "its a bee",
        beeFact:
          "The worker bees are all female and they do all the work for the hive. Workers perform the following tasks inside the hive as a House Bee: Cleaning, feeding the baby bees, feeding and taking care of the queen, packing pollen and nectar into cells, capping cells, building and repairing honeycombs, fanning to cool the hive and guarding the hive."
      },
      {
        name: "Hylaeus gabonicus",
        desc: "its a bee",
        beeFact:
          "Workers perform the following tasks outside the hive as Field Bees: Gathering nectar and pollen from flowers, collecting water and a sticky substance called propolis."
      },```

  ````

- GET a specific locations information - GET /api/v1/location/:id
  Hitting this point will return an array of bees at the specified location
- Example Response

````name: "Haiti",
    abbr: "HA",
    count: 34,
    bees: [
      {
        name: "Agapostemon centratus",
        desc: "its a bee",
        beeFact: "Bees are classified as insects and they have six legs."
      },
      {
        name: "Augochlora magnifica",
        desc: "its a bee",
        beeFact:
          "Bees have five eyes - two compound eyes and three tiny ocelli eyes."
      },
      {
        name: "Coelioxys vigilans",
        desc: "its a bee",
        beeFact:
          "Bees go through four stages of development: Egg, Larvae, Pupae and Adult Bee."
      },
      {
        name: "Megachile lanata",
        desc: "its a bee",
        beeFact:
          "The bees use their honeycomb cells to raise their babies in, and to store nectar, honey, pollen and water."
      },
      {
        name: "Xeromelecta haitensis",
        desc: "its a bee",
        beeFact:
          "Nectar is a sweet watery substance that the bees gather. After they process the nectar in their stomach they regurgitate it into the honeycomb cells. Then they fan with their wings to remove excess moisture. The final result is honey."
      }
    ] ```
````

- POST a new bee (all fields must be complete) POST /api/v1/bees/:id
  Hitting this point and providing the necessary information will allow you to add a bee to the database
- Example Response

```
      {
        name: "Autonomous Drone Insect",
        desc: "It's a harmless bee, I swear.",
        beeFact: "Don't say anything negative on social media though."
      },
```

- PATCH edit a location (all fields must be complete) PATCH /api/v1/bees/:id
  Hitting this point and providing the necessary information will allow you to edit an existing bee in the database
- Example Response

```
      {
        name: "Autonomous Drone Insect",
        desc: "Ok maybe these were a bad idea",
        beeFact: "Don't say anything negative on social media though."
      },
```

- Delete a location (all fields must be complete) DELETE /api/v1/location/:id
  Delete a location from the DB
