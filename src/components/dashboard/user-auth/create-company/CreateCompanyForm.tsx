'use client'

import React, { useState } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  FormControlLabel,
  Alert,
} from '@mui/material'
import CustomTextField from '@/components/forms/theme-elements/CustomTextField'
import CustomCheckbox from '@/components/forms/theme-elements/CustomCheckbox'
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel'
import ParentCard from '@/components/shared/ParentCard'
import { Stack } from '@mui/system'

const steps = ['ข้อมูลบริษัท', 'ข้อมูลผู้ติดต่อ', 'ยืนยัน']

const CreateCompanyForm = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set<number>())
  const [form, setForm] = useState({
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    agree: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const isStepOptional = (step: number) => false
  const isStepSkipped = (step: number) => skipped.has(step)

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // TODO: ส่งข้อมูลไป backend
    setActiveStep(steps.length)
  }

  const handleReset = () => {
    setActiveStep(0)
    setForm({
      companyName: '',
      companyEmail: '',
      companyAddress: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      agree: false,
    })
    setSubmitted(false)
  }

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <CustomFormLabel htmlFor='companyName'>ชื่อบริษัท</CustomFormLabel>
            <CustomTextField
              id='companyName'
              name='companyName'
              value={form.companyName}
              onChange={handleChange}
              variant='outlined'
              fullWidth
              required
            />
            <CustomFormLabel htmlFor='companyEmail' sx={{ mt: 2 }}>
              อีเมลบริษัท
            </CustomFormLabel>
            <CustomTextField
              id='companyEmail'
              name='companyEmail'
              type='email'
              value={form.companyEmail}
              onChange={handleChange}
              variant='outlined'
              fullWidth
              required
            />
            <CustomFormLabel htmlFor='companyAddress' sx={{ mt: 2 }}>
              ที่อยู่บริษัท
            </CustomFormLabel>
            <CustomTextField
              id='companyAddress'
              name='companyAddress'
              value={form.companyAddress}
              onChange={handleChange}
              variant='outlined'
              fullWidth
              multiline
              rows={3}
              required
            />
          </Box>
        )
      case 1:
        return (
          <Box>
            <CustomFormLabel htmlFor='contactName'>ชื่อผู้ติดต่อ</CustomFormLabel>
            <CustomTextField
              id='contactName'
              name='contactName'
              value={form.contactName}
              onChange={handleChange}
              variant='outlined'
              fullWidth
              required
            />
            <CustomFormLabel htmlFor='contactEmail' sx={{ mt: 2 }}>
              อีเมลผู้ติดต่อ
            </CustomFormLabel>
            <CustomTextField
              id='contactEmail'
              name='contactEmail'
              type='email'
              value={form.contactEmail}
              onChange={handleChange}
              variant='outlined'
              fullWidth
              required
            />
            <CustomFormLabel htmlFor='contactPhone' sx={{ mt: 2 }}>
              เบอร์โทรศัพท์
            </CustomFormLabel>
            <CustomTextField
              id='contactPhone'
              name='contactPhone'
              value={form.contactPhone}
              onChange={handleChange}
              variant='outlined'
              fullWidth
              required
            />
          </Box>
        )
      case 2:
        return (
          <Box pt={3}>
            <Typography variant='h6' mb={2}>
              ตรวจสอบข้อมูลก่อนยืนยัน
            </Typography>
            <Typography variant='body2'>
              <b>ชื่อบริษัท:</b> {form.companyName}
              <br />
              <b>อีเมลบริษัท:</b> {form.companyEmail}
              <br />
              <b>ที่อยู่บริษัท:</b> {form.companyAddress}
              <br />
              <b>ชื่อผู้ติดต่อ:</b> {form.contactName}
              <br />
              <b>อีเมลผู้ติดต่อ:</b> {form.contactEmail}
              <br />
              <b>เบอร์โทรศัพท์:</b> {form.contactPhone}
            </Typography>
            <FormControlLabel
              control={
                <CustomCheckbox
                  checked={form.agree}
                  onChange={handleChange}
                  name='agree'
                />
              }
              label='ยอมรับเงื่อนไขการใช้งาน'
              sx={{ mt: 2 }}
            />
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <ParentCard title='สร้างบริษัทใหม่'>
      <form onSubmit={handleSubmit}>
        <Box width='100%'>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Stack spacing={2} mt={3}>
              <Alert severity='success'>สร้างบริษัทสำเร็จ!</Alert>
              <Box textAlign='right'>
                <Button onClick={handleReset} variant='contained' color='error'>
                  สร้างใหม่
                </Button>
              </Box>
            </Stack>
          ) : (
            <>
              <Box mt={3}>{renderStep(activeStep)}</Box>
              <Box display='flex' flexDirection='row' mt={3}>
                <Button
                  color='inherit'
                  variant='contained'
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}>
                  กลับ
                </Button>
                <Box flex='1 1 auto' />
                {activeStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    variant='contained'
                    color='secondary'
                    disabled={
                      (activeStep === 0 &&
                        (!form.companyName ||
                          !form.companyEmail ||
                          !form.companyAddress)) ||
                      (activeStep === 1 &&
                        (!form.contactName ||
                          !form.contactEmail ||
                          !form.contactPhone))
                    }>
                    ถัดไป
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disabled={!form.agree}>
                    ยืนยัน
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </form>
    </ParentCard>
  )
}

export default CreateCompanyForm
