import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Breadcrumbs,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL, PACS_URL } from '../config';

const fetchStudy = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const { data } = await axios.get(`${API_URL}/report/${id}`);
  console.log(data);
  return data;
};

const updateStudy = async ({ id, updates }) => {
  const { data } = await axios.put(`${API_URL}/report/${id}`, updates);
  return data;
};


const questionMapping = {
  reasonForStudy: {
    question: "Причина исследования:",
  },
  stepsBeforeStudy: {
    question: "Какие действия предпринимались до исследования:",
  },
  additionalInfo: {
    question: "Дополнительная информация:",
  },
  allergyReaction: {
    question: "Есть ли аллергические реакции?",
    options: ["Нет", "Да"], // Example of predefined options
  },
  allergyDescription: {
    question: "Описание аллергических реакций:",
    dependsOn: {
      field: "allergyReaction",
      value: "Да", // Display this question only if `allergyReaction` is "Да"
    },
  },
  isPregnant: {
    question: "Беременны ли Вы в настоящее время?",
    dependsOn: {
      field: "patientInfo.sex",
      value: "f", // Display only if the patient's gender is female
    },
    options: ["Нет", "Да"],
  },
  pregnancyDuration: {
    question: "Срок беременности:",
    dependsOn: {
      field: "isPregnant",
      value: "Да",
    },
  },
  hadMriBefore: {
    question: "Проходили ли ранее МРТ?",
    options: ["Нет", "Да"],
  },
  previousMri: {
    question: "Какие обследования проводились ранее?",
    dependsOn: {
      field: "hadMriBefore",
      value: "Да",
    },
  },
  hadSurgery: {
    question: "Проводились ли операции?",
    options: ["Нет", "Да"],
  },
  previousSurgery: {
    question: "Какие были перенесены операции?",
    dependsOn: {
      field: "hadSurgery",
      value: "Да",
    },
  },
  hasPacemaker: {
    question: "Установлен ли кардиостимулятор?",
    options: ["Нет", "Да"],
  },
  hasHeartValve: {
    question: "Установлен ли протез сердечного клапана?",
    options: ["Нет", "Да"],
  },
  hasHearingAid: {
    question: "Установлен ли ушной аппарат?",
    options: ["Нет", "Да"],
  },
  hasJointProsthesis: {
    question: "Установлены ли протезы сустава?",
    options: ["Нет", "Да"],
  },
  hasDentalProsthesis: {
    question: "Установлены ли зубные протезы?",
    options: ["Нет", "Да"],
  },
  hasAneurysms: {
    question: "Есть ли аневризмы?",
    options: ["Нет", "Да"],
  },
  hasCatheters: {
    question: "Имеются ли подключенные катетеры?",
    options: ["Нет", "Да"],
  },
  hasIud: {
    question: "Установлена ли внутриматочная спираль?",
    options: ["Нет", "Да"],
    dependsOn: {
      field: "patientInfo.sex",
      value: "f",
    },
  },
  hasMetalObjects: {
    question: "Есть ли металлические объекты (скобы, дробь и т.д.)?",
    options: ["Нет", "Да"],
  },
  otherInfo: {
    question: "Другое:",
  },
};



export default function StudyReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { auth } = useAuth(); // Access the authenticated user information

  // STATES //

  const [openStudy, setOpenStudy] = useState(true);
  const [openPatientInfo, setOpenPatientInfo] = useState(true);
  const [openStudyOverview, setOpenStudyOverview] = useState(false);
  const [openQuestionnaire, setOpenQuestionnaire] = useState(true);
  const [reportDescriptionText, setReportDescriptionText] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [doNotShowModal, setDoNotShowModal] = useState(
    localStorage.getItem('doNotShowFinalizeModal') === 'true'
  );


  
  // DATABASE WORK //
  

  const { data: reportData, error, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn: fetchStudy
  });


  useEffect(() => {
    if (reportData?.description?.text) {
      setReportDescriptionText(reportData.description.text);
    }
  }, [reportData]); 

  const mutation = useMutation({
    mutationFn: updateStudy,
    onSuccess: () => {
      queryClient.invalidateQueries(['study', id]);
      toast.success('Исследование успешно обновлено!', {
        position: "top-right",
        autoClose: 3000
      });
    },
    onError: () => {
      toast.error('Ошибка при обновлении исследования.', {
        position: "top-right",
        autoClose: 3000
      });
    }
  });


  // UTIL FUNCTIONS //
  
  const toggleStudy = () => setOpenStudy(!openStudy);
  const togglePatientInfo = () => setOpenPatientInfo(!openPatientInfo);
  const toggleStudyOverview = () => setOpenStudyOverview(!openStudyOverview);
  const toggleQuestionnaire = () => setOpenQuestionnaire(!openQuestionnaire);

  const reportFinalize = (status) => {
    const updates = {
      description: {
        text: reportDescriptionText,
        doctor_information: {
          fullname: auth?.doctor_information?.fullname || "Unknown Doctor",
          id: auth?.doctor_information?.id || "Unknown ID",
        }
      },
      status: status // depends on what button clicked
    };

    console.log(updates);
    mutation.mutate({ id, updates });
  }

  // HANDLER FUNCTIONS //

  const handleReportChange = (event) => setReportDescriptionText(event.target.value);

  const handleReportDraftSaveButton = () => {
    reportFinalize("draft");
    setTimeout(() => {
      navigate('/worklist');
    }, 3000);
  }

  const handleLockReportButton = () => {
    reportFinalize("draft");
  }


  const handleReportFinalizeButton = () => {
    if (doNotShowModal) {
      reportFinalize("QA");
      
      setTimeout(() => {
        navigate('/worklist');
      }, 3000);
    } else {
      setShowModal(true);
    }
  };

  const handleReportFinalizeModal = () => {
    reportFinalize("QA");
    setShowModal(false);
    
    setTimeout(() => {
      navigate('/worklist');
    }, 3000);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleDoNotShowChange = (event) => {
    const value = event.target.checked;
    setDoNotShowModal(value);
    localStorage.setItem('doNotShowFinalizeModal', value.toString());
  };

  // RETURNS //

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching data</Typography>;
  if (!reportData) return <Typography>No data available</Typography>;

  // JSX //

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2, justifyContent: 'space-between' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/worklist">
            Все исследования
          </Link>
          <Typography color="textPrimary">{id}</Typography>
        </Breadcrumbs>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          
          <Button variant="contained" color="error" onClick={handleLockReportButton}>[LOCK] Бронь исследования</Button>
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
        <Paper sx={{ flex: 4, padding: 2, borderRadius: 2 }}>
          <Box>
            <Button onClick={toggleStudy} endIcon={openStudy ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
              Исследование
            </Button>
            <Collapse in={openStudy}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Дата исследования</TableCell>
                    <TableCell>Модальность</TableCell>
                    <TableCell>Медицинские записи</TableCell>
                    <TableCell>Изображения</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.study && (
                    <TableRow> 
                      <TableCell>{reportData.study.study_date}</TableCell>
                      <TableCell>{reportData.study.modality}</TableCell>
                      <TableCell>{reportData.important_information.med_records.length > 0 ? 'Есть' : 'Нет'}</TableCell>
                      <TableCell>
                        <Link href={`${PACS_URL}/studies/${reportData.study.pacs_tree.study_instance_uid? reportData.study.pacs_tree.study_instance_uid: "ERROR"}/archive`} target="_blank">
                          Скачать DICOM Архив исследования
                        </Link>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Collapse>
          </Box>
          <Box>
            <Button onClick={togglePatientInfo} endIcon={openPatientInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
              Информация о пациенте
            </Button>
            <Collapse in={openPatientInfo}>
              <Box sx={{ padding: 2 }}>
                <Typography variant="body1"><strong>Имя пациента:</strong> {reportData.important_information.patient.name}</Typography>
                <Typography variant="body1"><strong>Дата рождения пациента:</strong> {reportData.important_information.patient.dob}</Typography>
                <Typography variant="body1"><strong>Пол:</strong> {reportData.important_information.patient.gender === "m" ? "Мужской": "Женский"}</Typography>
                <Typography variant="body1"><strong>ИИН:</strong> {reportData.important_information.patient.iin}</Typography>
              </Box>
            </Collapse>
          </Box>
          {/* <Box>
            <Button onClick={toggleStudyOverview} endIcon={openStudyOverview ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
              Обзор исследования
            </Button>
            <Collapse in={openStudyOverview}>
              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">Содержание обзора исследования</Typography>
              </Box>
            </Collapse>
          </Box> */}
          
          <Box>
            <Button onClick={toggleQuestionnaire} endIcon={openQuestionnaire ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
              Анкета
            </Button>
            <Collapse in={openQuestionnaire}>
              <Box sx={{ padding: 2 }}>
                {reportData.important_information.questionnaire?.map((q, index) => {
                  // Get the question config from the questionMapping
                  const questionConfig = questionMapping[q.question];

                  // Skip if no config is found for the question
                  if (!questionConfig) return null;

                  // Handle dependencies
                  if (questionConfig.dependsOn) {
                    const dependentValue = reportData.important_information.questionnaire.find(
                      (dep) => dep.question === questionConfig.dependsOn.field
                    )?.answer;

                    if (dependentValue !== questionConfig.dependsOn.value) {
                      return null; // Skip rendering this question
                    }
                  }

                  return (
                    <Typography key={index} variant="body1">
                      <strong>{questionConfig.question}</strong> {q.answer}
                    </Typography>
                  );
                })}
              </Box>
            </Collapse>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
              Назад
            </Button>
            <Button variant="contained" color="success">Открыть все исследования</Button>
          </Box>
        </Paper>
        <Paper sx={{ flex: 6, padding: 2, borderRadius: 2 }}>
          <Typography variant="h6">Радиологический отчет:</Typography>
          <TextField
            fullWidth
            multiline
            minRows={10}
            value={reportDescriptionText}
            onChange={handleReportChange}
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Button variant="contained" color="success" onClick={handleReportFinalizeButton}>Завершить и Отправить</Button>
            <Button variant="contained" color="inherit" onClick={handleReportDraftSaveButton}>Сохранить черновик</Button>
          </Stack>
        </Paper>
      </Box>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onClose={handleModalClose}>
        <DialogTitle>Подтверждение завершения</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите завершить отчет? После завершения он будет отправлен и больше не сможет быть изменен.
          </DialogContentText>
          <FormControlLabel
            control={
              <Checkbox
                checked={doNotShowModal}
                onChange={handleDoNotShowChange}
              />
            }
            label="Больше не показывать это окно"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="inherit">
            Отмена
          </Button>
          <Button onClick={handleReportFinalizeModal} color="primary">
            Завершить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
