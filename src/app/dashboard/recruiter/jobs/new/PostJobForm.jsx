'use client';

import React, { useState } from 'react';
import {
  Form,
  Fieldset,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
  Select,
  ListBox,
  Switch,
  Button,
} from '@heroui/react';
import { Briefcase, Globe } from '@gravity-ui/icons';
import { createJob } from '@/lib/actions/jobs';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PostJobForm({ company }) {
  const [isRemote, setIsRemote] = useState(false);
  const [errors, setErrors] = useState({});

  // Theme colors matching your dashboard
  const theme = {
    bg: '#0f0f1a', // Page background
    surface: '#16162a', // Card background
    surfaceHover: '#1e1e35', // Hover state
    border: '#2a2a45', // Borders
    headerBg: '#13132280', // Header background
    purple: '#7C3AED', // Primary purple
    purpleLight: '#9F67FA', // Light purple
    text: '#e2e2f0', // Main text
    textMuted: '#6b6b8a', // Muted text
    textSub: '#9494b8', // Subtle text
    inputBg: '#1c1c1e', // Input background
    inputBorder: '#2a2a45', // Input border
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (company.isApproved === false) {
      toast.error(
        'Your company profile must be approved before you can post jobs.',
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};
    if (!data.jobTitle) newErrors.jobTitle = 'Job title is required';
    if (!data.jobCategory) newErrors.jobCategory = 'Job category is required';
    if (!data.jobType) newErrors.jobType = 'Job type is required';
    if (!data.minSalary) newErrors.minSalary = 'Minimum salary is required';
    if (!data.maxSalary) newErrors.maxSalary = 'Maximum salary is required';
    if (!isRemote && !data.location)
      newErrors.location = 'Location is required for non-remote roles';
    if (!data.deadline) newErrors.deadline = 'Application deadline is required';
    if (!data.responsibilities)
      newErrors.responsibilities = 'Responsibilities are required';
    if (!data.requirements)
      newErrors.requirements = 'Requirements are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 23) + 'Z';

    const payload = {
      jobTitle: data.jobTitle,
      jobCategory: data.jobCategory,
      jobType: data.jobType,
      minSalary: data.minSalary,
      maxSalary: data.maxSalary,
      currency: data.currency || 'EUR',
      location: data.location,
      deadline: data.deadline,
      responsibilities: data.responsibilities,
      requirements: data.requirements,
      benefits: data.benefits || '',
      isRemote: isRemote,
      companyId: company._id,
      companyName: company.name,
      companyLogo: company.logo,
      status: 'active',
      isPubliclyVisible: true,
      createdAt: {
        date: formattedDate,
      },
    };

    try {
      const res = await createJob(payload);

      if (res.insertedId) {
        toast.success('Job posted successfully!');
        e.target.reset();
        setIsRemote(false);
        setTimeout(() => {
          redirect('/dashboard/recruiter/jobs');
        }, 1500);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    }
  };

  // Updated styles with dashboard theme
  const textInputClass = `w-full text-white bg-[${theme.inputBg}] border border-[${theme.inputBorder}] hover:bg-[${theme.surfaceHover}] focus:border-[${theme.purple}] rounded-lg h-12 px-3 text-sm placeholder:text-[${theme.textMuted}] outline-none transition-all`;
  const textAreaClass = `w-full text-white bg-[${theme.inputBg}] border border-[${theme.inputBorder}] hover:bg-[${theme.surfaceHover}] focus:border-[${theme.purple}] rounded-lg p-3 text-sm placeholder:text-[${theme.textMuted}] outline-none transition-all`;

  const triggerClasses = `w-full flex items-center justify-between bg-[${theme.inputBg}] border border-[${theme.inputBorder}] hover:bg-[${theme.surfaceHover}] h-12 rounded-lg px-3 text-white transition-all text-sm outline-none data-[focused=true]:border-[${theme.purple}] data-[invalid=true]:border-danger`;
  const popoverClasses = `bg-[${theme.surface}] border border-[${theme.border}] text-white rounded-lg shadow-xl p-1`;
  const listItemClasses = `flex items-center justify-between p-2 rounded-md hover:bg-[${theme.surfaceHover}] cursor-pointer text-sm text-[${theme.textSub}] outline-none data-[focused=true]:bg-[${theme.surfaceHover}]`;

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: theme.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Form Header */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: '0 8px 32px #00000044',
          }}
        >
          {/* subtle top accent line */}
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(90deg,${theme.purple},${theme.purpleLight},transparent)`,
            }}
          />

          <div className="p-8">
            {/* Header content */}
            <div
              className="border-b pb-6 mb-8"
              style={{ borderColor: theme.border }}
            >
              <h1
                className="text-2xl font-semibold tracking-tight"
                style={{ color: theme.text }}
              >
                Post a New Job
              </h1>
              <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
                Fill out the details below to publish your open position.
              </p>

              {/* Company information panel */}
              <div
                className="mt-4 flex items-center gap-3 rounded-lg px-4 py-2"
                style={{
                  background: theme.headerBg,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {company.logo && (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ background: theme.inputBg }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} style={{ color: theme.textMuted }} />
                    <span
                      className="text-xs"
                      style={{ color: theme.textMuted }}
                    >
                      Posting as:
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: theme.text }}
                    >
                      {company.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px]"
                      style={{ color: theme.textMuted }}
                    >
                      ID: {company._id}
                    </span>
                    {company.isApproved && (
                      <span
                        className="font-medium text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background: '#0d2e1a',
                          color: '#34d47a',
                          border: '1px solid #34d47a33',
                        }}
                      >
                        Approved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <Form
              onSubmit={handleSubmit}
              className="space-y-8"
              validationErrors={errors}
              validationBehavior="aria"
            >
              {/* SECTION 1: Job Information */}
              <Fieldset className="space-y-6 w-full">
                <legend
                  className="text-lg font-medium w-full pb-2 mb-2"
                  style={{
                    color: theme.textSub,
                    borderBottom: `1px solid ${theme.border}`,
                  }}
                >
                  Job Information
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    name="jobTitle"
                    isInvalid={!!errors.jobTitle}
                    className="flex flex-col gap-1 w-full"
                  >
                    <Label
                      className="font-medium text-sm"
                      style={{ color: theme.textMuted }}
                    >
                      Job Title
                    </Label>
                    <Input
                      placeholder="e.g. Senior Frontend Engineer"
                      className={textInputClass}
                      style={{
                        background: theme.inputBg,
                        borderColor: theme.inputBorder,
                        color: theme.text,
                      }}
                    />
                    {errors.jobTitle && (
                      <FieldError className="text-xs text-danger mt-1">
                        {errors.jobTitle}
                      </FieldError>
                    )}
                  </TextField>

                  <Select
                    className="w-full"
                    name="jobCategory"
                    isInvalid={!!errors.jobCategory}
                  >
                    <Label
                      className="font-medium text-sm mb-1 block"
                      style={{ color: theme.textMuted }}
                    >
                      Job Category
                    </Label>
                    <Select.Trigger
                      className={triggerClasses}
                      style={{ background: theme.inputBg }}
                    >
                      <Select.Value className="text-white" />
                      <Select.Indicator />
                    </Select.Trigger>
                    {errors.jobCategory && (
                      <span className="text-xs text-danger mt-1">
                        {errors.jobCategory}
                      </span>
                    )}
                    <Select.Popover className={popoverClasses}>
                      <ListBox className="outline-none">
                        <ListBox.Item
                          id="technology"
                          className={listItemClasses}
                          textValue="Technology"
                        >
                          Technology
                        </ListBox.Item>
                        <ListBox.Item
                          id="design"
                          className={listItemClasses}
                          textValue="Design"
                        >
                          Design
                        </ListBox.Item>
                        <ListBox.Item
                          id="marketing"
                          className={listItemClasses}
                          textValue="Marketing"
                        >
                          Marketing
                        </ListBox.Item>
                        <ListBox.Item
                          id="sales"
                          className={listItemClasses}
                          textValue="Sales"
                        >
                          Sales
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    className="w-full"
                    name="jobType"
                    isInvalid={!!errors.jobType}
                  >
                    <Label
                      className="font-medium text-sm mb-1 block"
                      style={{ color: theme.textMuted }}
                    >
                      Job Type
                    </Label>
                    <Select.Trigger
                      className={triggerClasses}
                      style={{ background: theme.inputBg }}
                    >
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    {errors.jobType && (
                      <span className="text-xs text-danger mt-1">
                        {errors.jobType}
                      </span>
                    )}
                    <Select.Popover className={popoverClasses}>
                      <ListBox className="outline-none">
                        <ListBox.Item
                          id="full-time"
                          className={listItemClasses}
                          textValue="Full-time"
                        >
                          Full-time
                        </ListBox.Item>
                        <ListBox.Item
                          id="part-time"
                          className={listItemClasses}
                          textValue="Part-time"
                        >
                          Part-time
                        </ListBox.Item>
                        <ListBox.Item
                          id="contract"
                          className={listItemClasses}
                          textValue="Contract"
                        >
                          Contract
                        </ListBox.Item>
                        <ListBox.Item
                          id="internship"
                          className={listItemClasses}
                          textValue="Internship"
                        >
                          Internship
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <span
                        className="font-medium text-sm block"
                        style={{ color: theme.textMuted }}
                      >
                        Salary Range
                      </span>
                      <div className="flex gap-2">
                        <TextField
                          name="minSalary"
                          isInvalid={!!errors.minSalary}
                          className="w-full"
                        >
                          <Input
                            placeholder="Min"
                            type="number"
                            className={textInputClass}
                            style={{ background: theme.inputBg }}
                          />
                        </TextField>
                        <TextField
                          name="maxSalary"
                          isInvalid={!!errors.maxSalary}
                          className="w-full"
                        >
                          <Input
                            placeholder="Max"
                            type="number"
                            className={textInputClass}
                            style={{ background: theme.inputBg }}
                          />
                        </TextField>
                      </div>
                    </div>

                    <Select
                      className="w-full mt-6"
                      name="currency"
                      defaultSelectedKeys={['EUR']}
                    >
                      <Select.Trigger
                        className={triggerClasses}
                        style={{ background: theme.inputBg }}
                      >
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover className={popoverClasses}>
                        <ListBox className="outline-none">
                          <ListBox.Item
                            id="USD"
                            className={listItemClasses}
                            textValue="USD"
                          >
                            USD ($)
                          </ListBox.Item>
                          <ListBox.Item
                            id="EUR"
                            className={listItemClasses}
                            textValue="EUR"
                          >
                            EUR (€)
                          </ListBox.Item>
                          <ListBox.Item
                            id="GBP"
                            className={listItemClasses}
                            textValue="GBP"
                          >
                            GBP (£)
                          </ListBox.Item>
                          <ListBox.Item
                            id="BDT"
                            className={listItemClasses}
                            textValue="BDT"
                          >
                            BDT (৳)
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="font-medium text-sm"
                        style={{ color: theme.textMuted }}
                      >
                        Location
                      </span>
                      <Switch
                        isSelected={isRemote}
                        onChange={setIsRemote}
                        size="sm"
                      >
                        <Switch.Control className="bg-zinc-800 data-[selected=true]:bg-white">
                          <Switch.Thumb className="bg-zinc-400 data-[selected=true]:bg-black" />
                        </Switch.Control>
                        <Switch.Content>
                          <Label
                            className="text-xs font-medium"
                            style={{ color: theme.textMuted }}
                          >
                            Remote
                          </Label>
                        </Switch.Content>
                      </Switch>
                    </div>

                    <TextField
                      name="location"
                      isInvalid={!isRemote && !!errors.location}
                      className="flex flex-col gap-1 w-full relative"
                    >
                      <div className="relative flex items-center">
                        <Globe
                          size={16}
                          className="absolute left-3 z-10"
                          style={{ color: theme.textMuted }}
                        />
                        <Input
                          placeholder={
                            isRemote
                              ? 'Global / Remote'
                              : 'e.g. Chittagong, Dhaka'
                          }
                          disabled={isRemote}
                          className={`${textInputClass} pl-10`}
                          style={{ background: theme.inputBg }}
                        />
                      </div>
                      {!isRemote && errors.location && (
                        <FieldError className="text-xs text-danger mt-1">
                          {errors.location}
                        </FieldError>
                      )}
                    </TextField>
                  </div>

                  <TextField
                    name="deadline"
                    isInvalid={!!errors.deadline}
                    className="flex flex-col gap-1 w-full"
                  >
                    <Label
                      className="font-medium text-sm"
                      style={{ color: theme.textMuted }}
                    >
                      Application Deadline
                    </Label>
                    <Input
                      type="date"
                      className={textInputClass}
                      style={{ background: theme.inputBg }}
                    />
                    {errors.deadline && (
                      <FieldError className="text-xs text-danger mt-1">
                        {errors.deadline}
                      </FieldError>
                    )}
                  </TextField>
                </div>
              </Fieldset>

              {/* SECTION 2: Job Description */}
              <Fieldset className="space-y-6 w-full">
                <legend
                  className="text-lg font-medium w-full pb-2 mb-2"
                  style={{
                    color: theme.textSub,
                    borderBottom: `1px solid ${theme.border}`,
                  }}
                >
                  Job Details & Description
                </legend>

                <TextField
                  name="responsibilities"
                  isInvalid={!!errors.responsibilities}
                  className="flex flex-col gap-1 w-full"
                >
                  <Label
                    className="font-medium text-sm"
                    style={{ color: theme.textMuted }}
                  >
                    Responsibilities
                  </Label>
                  <TextArea
                    placeholder="Outline the core everyday responsibilities for this role..."
                    rows={4}
                    className={textAreaClass}
                    style={{ background: theme.inputBg }}
                  />
                  {errors.responsibilities && (
                    <FieldError className="text-xs text-danger mt-1">
                      {errors.responsibilities}
                    </FieldError>
                  )}
                </TextField>

                <TextField
                  name="requirements"
                  isInvalid={!!errors.requirements}
                  className="flex flex-col gap-1 w-full"
                >
                  <Label
                    className="font-medium text-sm"
                    style={{ color: theme.textMuted }}
                  >
                    Requirements
                  </Label>
                  <TextArea
                    placeholder="List required experience, skills, and certifications..."
                    rows={4}
                    className={textAreaClass}
                    style={{ background: theme.inputBg }}
                  />
                  {errors.requirements && (
                    <FieldError className="text-xs text-danger mt-1">
                      {errors.requirements}
                    </FieldError>
                  )}
                </TextField>

                <TextField
                  name="benefits"
                  className="flex flex-col gap-1 w-full"
                >
                  <Label
                    className="font-medium text-sm"
                    style={{ color: theme.textMuted }}
                  >
                    Benefits (Optional)
                  </Label>
                  <TextArea
                    placeholder="Perks, healthcare, equity, remote stipends..."
                    rows={3}
                    className={textAreaClass}
                    style={{ background: theme.inputBg }}
                  />
                </TextField>
              </Fieldset>

              {/* Form Actions */}
              <div
                className="flex justify-end gap-3 pt-4 border-t"
                style={{ borderColor: theme.border }}
              >
                <Button
                  type="button"
                  variant="bordered"
                  className="rounded-lg px-6 font-medium h-11"
                  style={{
                    borderColor: theme.border,
                    color: theme.textSub,
                    background: 'transparent',
                  }}
                  onClick={() => redirect('/dashboard/recruiter/jobs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="font-semibold rounded-lg px-6 transition-colors h-11"
                  style={{
                    background: `linear-gradient(135deg,${theme.purple},${theme.purpleLight})`,
                    color: '#fff',
                    boxShadow: `0 4px 18px ${theme.purple}44`,
                  }}
                >
                  Post Job
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
