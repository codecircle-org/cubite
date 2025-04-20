'use client'
import React, { useState } from 'react'
import { Github, Mail, Facebook } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from 'react-hot-toast'
import { Site } from '@prisma/client'

function SocialSSO({ site }: { site: Site }) {
  
    const handleGithubClientIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateSite = await fetch(`/api/site/${site.domainName}/ssoProviders`, {
            method: 'PUT',
            body: JSON.stringify({
                siteId: site.id,
                ssoProviders: {
                    githubClientId: e.target.value
                }
            })
        })
        const result = await updateSite.json()
        if (result.status === 200) {
            toast.success('Github client id updated successfully')
        } else {
            toast.error('Failed to update Github client id')
        }
    }
    const handleGithubClientSecretChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateSite = await fetch(`/api/site/${site.domainName}/ssoProviders`, {
            method: 'PUT',
            body: JSON.stringify({
                siteId: site.id,
                ssoProviders: {
                    githubClientSecret: e.target.value
                }
            })
        })
        const result = await updateSite.json()
        if (result.status === 200) {
            toast.success('Github client secret updated successfully')
        } else {
            toast.error('Failed to update Github client secret')
        }
    }
    const handleGoogleClientIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateSite = await fetch(`/api/site/${site.domainName}/ssoProviders`, {
            method: 'PUT',
            body: JSON.stringify({
                siteId: site.id,
                ssoProviders: {
                    googleClientId: e.target.value
                }
            })
        })
        const result = await updateSite.json()
        if (result.status === 200) {
            toast.success('Google client id updated successfully')
        } else {
            toast.error('Failed to update Google client id')
        }
    }
    const handleGoogleClientSecretChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateSite = await fetch(`/api/site/${site.domainName}/ssoProviders`, {
            method: 'PUT',
            body: JSON.stringify({
                siteId: site.id,
                ssoProviders: {
                    googleClientSecret: e.target.value
                }
            })
        })
        const result = await updateSite.json()
        if (result.status === 200) {
            toast.success('Google client secret updated successfully')
        } else {
            toast.error('Failed to update Google client secret')
        }
    }
    const handleFacebookClientIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateSite = await fetch(`/api/site/${site.domainName}/ssoProviders`, {
            method: 'PUT',
            body: JSON.stringify({
                siteId: site.id,
                ssoProviders: {
                    facebookClientId: e.target.value
                }
            })
        })
        const result = await updateSite.json()
        if (result.status === 200) {
            toast.success('Facebook client id updated successfully')
        } else {
            toast.error('Failed to update Facebook client id')
        }
    }
    const handleFacebookClientSecretChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const updateSite = await fetch(`/api/site/${site.domainName}/ssoProviders`, {
            method: 'PUT',
            body: JSON.stringify({
                siteId: site.id,
                ssoProviders: {
                    facebookClientSecret: e.target.value
                }
            })
        })
        const result = await updateSite.json()
        if (result.status === 200) {
            toast.success('Facebook client secret updated successfully')
        } else {
            toast.error('Failed to update Facebook client secret')
        }
    }
    

  return (
    <div className="w-full my-8 border-2 border-dashed border-gray-100 p-4">
    <h2 className="text-lg font-medium">Social Single Sign On</h2>
    <div className="mt-8 font-medium flex items-center gap-2 my-2"><Github className="w-6 h-6" /> <span className="">Github</span></div>
    <div className="grid grid-cols-4 gap-4 mb-12">
      <div className="col-span-2">
        <label className="form-control w-full min-w-xs">
          <div className="label">
            <span className="label-text">Client ID</span>
          </div>
          <input
            onChange={handleGithubClientIdChange}
            defaultValue={site.ssoProviders?.githubClientId}
            type="password"
            placeholder="Client ID"
            className="input input-bordered w-full max-w-full"
          />
        </label>
      </div>
      <div className="col-span-2">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Client Secret</span>
          </div>
          <input
            onChange={handleGithubClientSecretChange}
            type="password"
            placeholder="Client Secret"
            defaultValue={site.ssoProviders?.githubClientSecret}
            className="input input-bordered w-full max-w-full"
          />
        </label>
      </div>
    </div>

    <div className="mt-8 font-medium flex items-center gap-2 my-2"><FcGoogle className="w-6 h-6" /> <span className="">Google</span></div>
    <div className="grid grid-cols-4 gap-4 mb-12">
      <div className="col-span-2">
        <label className="form-control w-full min-w-xs">
          <div className="label">
            <span className="label-text">Client ID</span>
          </div>
          <input
            onChange={handleGoogleClientIdChange}
            type="password"
            placeholder="Client ID"
            defaultValue={site.ssoProviders?.googleClientId}
            className="input input-bordered w-full max-w-full"
          />
        </label>
      </div>
      <div className="col-span-2">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Client Secret</span>
          </div>
          <input
            onChange={handleGoogleClientSecretChange}
            type="password"
            placeholder="Client Secret"
            defaultValue={site.ssoProviders?.googleClientSecret}
            className="input input-bordered w-full max-w-full"
          />
        </label>
      </div>
    </div>

    <div className="mt-8 font-medium flex items-center gap-2 my-2"><Facebook className="w-6 h-6" /> <span className="">Facebook</span></div>
    <div className="grid grid-cols-4 gap-4 mb-12">
      <div className="col-span-2">
        <label className="form-control w-full min-w-xs">
          <div className="label">
            <span className="label-text">Client ID</span>
          </div>
          <input
            onChange={handleFacebookClientIdChange}
            defaultValue={site.ssoProviders?.facebookClientId}
            type="password"
            placeholder="Client ID"
            className="input input-bordered w-full max-w-full"
          />
        </label>
      </div>
      <div className="col-span-2">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Client Secret</span>
          </div>
          <input
            onChange={handleFacebookClientSecretChange}
            type="password"
            placeholder="Client Secret"
            defaultValue={site.ssoProviders?.facebookClientSecret}
            className="input input-bordered w-full max-w-full"
          />
        </label>
      </div>
    </div>
  </div>
    )
}

export default SocialSSO