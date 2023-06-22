<template>
  <div class="wrap">
    <div v-if="isComplex" class="left">
      <DayPilotNavigator id="nav" :config="navigatorConfig" ref="navigator" />
    </div>
    <div class="content">
      <DayPilotCalendar id="dp" :config="config" ref="calendarRef" />
    </div>
  </div>
</template>

<script>
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from '@daypilot/daypilot-lite-vue'
import {onMounted, ref, watch} from "vue";
import { areIntervalsOverlapping } from "date-fns";

export default {
  name: 'WeeklyCalendar',
  components: {
    DayPilotCalendar,
    DayPilotNavigator
  },
  props: {
    isComplex: {
      type: Boolean,
      required: false,
      default: true
    },
    listaExamene: {
      type: Array,
      required: true,
      default: () => []
    },
    listaSali: {
      type: Array,
      required: false,
      default: () => []
    },
    listaDiscipline: {
      type: Array,
      required: false,
      default: () => []
    },
    selectedExam: {
      type: Object,
      required: false,
      default: () => {}
    },
    currentUser: {
      type: Object,
      required: false,
      default: () => {}
    },
  },
  setup(props, { emit }) {
    const calendarRef = ref(null);
    const config = ref(null);

    config.value = {
      viewType: "Week",
      startDate: DayPilot.Date.today(),
      timeRangeSelectedHandling: props.isComplex ? "Enabled" : "Disabled",
      onTimeRangeSelected: async (args) => {
        if (new Date(args.start) < new Date()) {
          calendarRef.value.control.clearSelection();
          return;
        }
        if (!props.isComplex) {
          return;
        }
        const existingExam = props.listaExamene.find(e =>
          areIntervalsOverlapping(
            {start: new Date(e.startDate), end: new Date(e.endDate)},
            {start: new Date(args.start), end: new Date(args.end)})
        );
        if (existingExam || props.currentUser.rol === "Profesor") {
          calendarRef.value.control.clearSelection();
          return;
        }
        await createEvent(args.start, args.end);
        calendarRef.value.control.clearSelection();
      },
      eventClickHandling: props.isComplex ? "Enabled" : "Disabled",
      eventMoveHandling: "Disabled",
      eventDeleteHandling: 'Disabled',
      eventResizeHandling: "Disabled",
      onEventClick: (args) => {
        if (!props.isComplex) {
          return;
        }
        editEvent(args.e);
      },
    };

    const navigatorConfig = {
      showMonths: 3,
      skipMonths: 3,
      selectMode: "Week",
      startDate: DayPilot.Date.today(),
      selectionDay: DayPilot.Date.today(),
      onTimeRangeSelected: args => {
        config.value.startDate = args.day;
      }
    }

    const createEvent = async (start, end) => {
      const form = [
        {name: "Sala", id: "sala", type: "select", options: props.listaSali.map(sala => ({id: sala.id, name: sala.nume}))},
        {name: "Disciplina", id: "disciplina", type: "select", options: props.listaDiscipline.map(disciplina => ({id: disciplina.id, name: disciplina.nume}))},
        {name: "Tip", id: "tip", type: "select", options: [{id: "examen", name: "Examen"}, {id: "Distribuita 1", name: "Distribuita 1"}, {id: "Distribuita 2", name: "Distribuita 2"}, {id: "Partial", name: "Partial"}]},
        {name: "Prezentare", id: "prezentare", type: "select", options: [{id: "P1", name: "P1"}, {id: "P2", name: "P2"}, {id: "P3", name: "P3"}, {id: "P4", name: "P4"}]},
        {name: "Start", id: "start", type: "datetime"},
        {name: "End", id: "end", type: "datetime"},
      ];
      const data = {
        start: start,
        end: end,
        id: DayPilot.guid()
      };
      await DayPilot.Modal.form(form, data).then((args) => {
        if (!args?.canceled) {
          const examenData = {
            nume: "Examen",
            startDate: new Date(start.value).toISOString(),
            endDate: new Date(end.value).toISOString(),
            disciplinaId: args.result.disciplina,
            salaId: args.result.sala,
            tip: args.result.tip,
            prezentare: args.result.prezentare,
          }
          emit('creeaza-examen', examenData);

          const sala = props.listaSali.find(s => s.id === args.result.sala);
          const disciplina = props.listaDiscipline.find(d => d.id === args.result.disciplina);
          const e = {
            ...args.result,
            text: `${disciplina.nume} - ${args.result.tip} - An: ${disciplina.an} - Sectie ${disciplina.sectie} - Prezentare ${args.result.prezentare} - Sala ${sala.nume}`
          }
          calendarRef.value.control.events.add(e);
        }
      });
    };

    const editEvent = async (e) => {
      const form = [
        {name: "Sala", id: "sala", type: "select", options: props.listaSali.map(sala => ({id: sala.id, name: sala.nume}))},
        {name: "Disciplina", id: "disciplina", type: "select", options: props.listaDiscipline.map(disciplina => ({id: disciplina.id, name: disciplina.nume}))},
        {name: "Tip", id: "tip", type: "select", options: [{id: "Examen", name: "Examen"},  {id: "Distribuita 1", name: "Distribuita 1"}, {id: "Distribuita 2", name: "Distribuita 2"}, {id: "Partial", name: "Partial"}]},
        {name: "Prezentare", id: "prezentare", type: "select", options: [{id: "P1", name: "P1"}, {id: "P2", name: "P2"}, {id: "P3", name: "P3"}, {id: "P4", name: "P4"}]},
        {name: "Start", id: "start", type: "datetime"},
        {name: "End", id: "end", type: "datetime"},
      ];

      await emit('get-by-id', e.data.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (props.selectedExam.creatorId !== props.currentUser.id || props.currentUser.rol === "Profesor" &&  props.currentUser.rol !== "Admin") return;
      const sala = props.listaSali.find(s => s.id === props.selectedExam.salaId);
      const salaData = {id: sala.id, name: sala.nume}
      const disciplina = props.listaDiscipline.find(d => d.id === props.selectedExam.disciplinaId);
      const disciplinaData = {id: disciplina.id, name: disciplina.nume}

      const data = {...e.data, sala: salaData, disciplina: disciplinaData};

      await DayPilot.Modal.form(form, data).then(async (args) => {
        if (!args?.canceled) {
          const examenData = {
            nume: "Examen",
            startDate: args.result.start.value,
            endDate: args.result.end.value,
            disciplinaId: args.result.disciplina || props.selectedExam.disciplinaId,
            salaId: args.result.sala || props.selectedExam.salaId,
            tip: args.result.tip || props.selectedExam.tip,
            prezentare: args.result.prezentare || props.selectedExam.prezentare
          }
          emit('editeaza-examen', props.selectedExam.id, examenData);
          const newSala = props.listaSali.find(s => s.id === args.result.sala);
          const disciplina = props.listaDiscipline.find(d => d.id === args.result.disciplina);
          const e = {
            ...args.result,
            text: `${disciplina.nume} - ${args.result.tip} - An: ${disciplina.an} - Sectie ${disciplina.sectie} - Prezentare ${args.result.prezentare} - Sala ${newSala.nume}`
          }
          calendarRef.value.control.events.update(e);
        }
      });
    };

    watch(() => props.listaExamene, (newValue) => {
      const data = newValue.map(exam => {
        return {
          id: exam.id,
          start: new Date(new Date(exam.startDate).setHours(new Date(exam.startDate).getHours() + 3)),
          end: new Date(new Date(exam.endDate).setHours(new Date(exam.endDate).getHours() + 3)),
          text: `${exam.nume}, An: ${exam.an} ${exam.sectie} - Sala ${exam.sala.nume}`,
        }
      });
      calendarRef.value.control.update({ events: data });
    });

    onMounted(() => {
      const data = props.listaExamene.map(exam => {
        return {
          id: exam.id,
          start: new Date(new Date(exam.startDate).setHours(new Date(exam.startDate).getHours() + 3)),
          end: new Date(new Date(exam.endDate).setHours(new Date(exam.endDate).getHours() + 3)),
          text: `${exam.disciplina.nume} - ${exam.tip} - An ${exam.an} - Sectie ${exam.sectie} - Prezentare ${exam.prezentare} - Sala ${exam.sala.nume} - Prof ${exam.disciplina.profesor.user.nume}`,
        }
      });
      calendarRef.value.control.update({ events: data });
    });

    return {
      config,
      navigatorConfig,
      calendarRef
    };
  }
}
</script>

<style>
.wrap {
  display: flex;
}

.left {
  margin-right: 10px;
}

.content {
  flex-grow: 1;
}
</style>
