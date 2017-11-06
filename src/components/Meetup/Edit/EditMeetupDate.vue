<template>
  <v-dialog width="350px" persistent v-model="editDialog">
    <v-btn class="primary" accent slot="activator">
      Edit Date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title><h6>Edit Meetup Date</h6></v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editableDate" style="width: 100%" actions>
              <template slot-scope="{save, cancel}">
                <v-btn class="blue--text darken-1" flat @click="editDialog = false">Close</v-btn>
                <v-btn class="blue--text darken-1" flat @click="saveChanges">Save</v-btn>
              </template>
            </v-date-picker>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editableDate: null
    }
  },
  methods: {
    saveChanges () {
      const newDate = new Date(this.meetup.date)
      const newDay = new Date(this.editableDate).getUTCDate()
      const newMonth = new Date(this.editableDate).getUTCMonth()
      const newYear = new Date(this.editableDate).getUTCFullYear()
      newDate.setUTCDate(newDay)
      newDate.setUTCMonth(newMonth)
      newDate.setUTCFullYear(newYear)
      this.$store.dispatch('updatedMeetup', {
        id: this.meetup.id,
        date: newDate
      })
    }
  },
  created () {
    this.editableDate = new Date(this.meetup.date)
  }
}
</script>
