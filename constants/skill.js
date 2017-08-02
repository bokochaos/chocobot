/*
 * Created:				25 July 2017
 * Last updated:		25 July 2017
 * Developer(s):		CodedLotus
 * Description:			Return data that returns skill details as sentences from http://terrabattle.wikia.com/wiki/Module:Skill
 * Version #:			1.0.0
 * Version Details:
		1.0.0: Cloned token returning functionality for skills string creation
		
 */



/*

local Skills = require("Module:Skills/Data").Skills
 
local p = {}
 
-- mimic Template:SkillIcon, since we can't call it here
function p.skillicon(id)
    return string.format("[[File:Skill icon %02d.png|link=|20x20px]]", id)
end
 
local function getrange(skill)
    if skill.range == "Pincer" then
        return ""
    end
    if skill.range == "All" and skill.target ~= "" then
        return ""
    end
    return skill.range
end
 
function p.forenemy(frame)
    if not frame.args.id then
        return "skill id is not provided"
    end
    local skill = Skills[tonumber(frame.args.id)]
    if not skill then
        return "skill not found"
    end
 
    local range = getrange(skill)
 
    local effprefix = ""
    if string.find(skill.condition, "Counter") then
        effprefix = skill.condition .. ": "
    end
 
    local effect = skill.effect
    if skill.blowoff > 0 then
        local blow = string.format("Knock foes back with power %d.",
            skill.blowoff)
        if effect == "" then
            effect = blow
        else
            effect = effect .. " " .. blow
        end
    end
    if effect == "" then
        effect = skill.descr
    end
 
    local s = {}
    table.insert(s, string.format("<span title=%q>", skill.descr))
    table.insert(s, p.skillicon(skill.iconid) .. " " .. skill.name)
    if range ~= "" then
        table.insert(s, ", " .. range)
    end
    if skill.target ~= "" then
        table.insert(s, ", " .. skill.target)
    end
    table.insert(s, "<br />")
    table.insert(s, string.format("<small>%s%s</small>",
        effprefix, effect))
    table.insert(s, "</span>")
    return table.concat(s, "") .. '\n'
end
 
function p.forally(frame)
    if not frame.args.id then
        return "skill id is not provided"
    end
    local skill = Skills[tonumber(frame.args.id)]
    if not skill then
        return "skill not found"
    end
 
    local range = getrange(skill)
 
    local effect = skill.effect
    if effect == "" then
        effect = skill.descr
    end
 
    local s = {}
    table.insert(s, p.skillicon(skill.iconid) .. " " .. skill.name)
    if range ~= "" then
        table.insert(s, ", " .. range)
    end
    if skill.target ~= "" then
        table.insert(s, ", " .. skill.target)
    end
    if skill.condition ~= "Equip" then
        if skill.condition == "Tap" then
            table.insert(s, string.format(", %d charges", skill.emitratio))
        else
            table.insert(s, string.format(", %d%%", skill.emitratio))
        end
    end
    table.insert(s, "<br />")
    table.insert(s, string.format("''[%s: %s]''", skill.condition, effect))
    return '<div style="color:#77AABB;font-size:10pt;">' ..
        string.format('<span title=%q>', skill.descr) ..
        table.concat(s, "") ..
        '</span>' ..
        '</div>\n'
end
 
-- Arguments:
--  id (skill ID)
--  nodescr (don't add in-game skill description)
--
function p.forcompanion(frame)
    if not frame.args.id then
        return "skill id is not provided"
    end
    local skill = Skills[tonumber(frame.args.id)]
    if not skill then
        return "skill not found"
    end
 
    local range = getrange(skill)
 
    local s = {}
    table.insert(s, p.skillicon(skill.iconid) .. " " .. skill.name)
    if range ~= "" then
        table.insert(s, ", " .. range)
    end
    if skill.target ~= "" then
        table.insert(s, ", " .. skill.target)
    end
    table.insert(s, "<br />")
 
    if skill.effect == "" then
        table.insert(s, string.format("<small>%s: ''%s''</small>",
            skill.condition, skill.descr))
    else
        table.insert(s, "<small>")
        if not frame.args.nodescr then
            table.insert(s, string.format("''%s''<br />", skill.descr))
        end
        table.insert(s, string.format("%s: %s</small>",
            skill.condition, skill.effect))
    end
    return table.concat(s, "") .. '\n'
end
 
function p._print(fname)
    for key, _ in pairs(Skills) do
        frame= {args = {id = key}}
        mw.log(p[fname](frame))
    end
end
 
-- Run this before saving changes.
function p._test()
    for key, _ in pairs(Skills) do
        frame= {args = {id = key}}
        for _, fname in ipairs({"forally", "forcompanion", "forenemy"}) do
            local s1 = p[fname](frame)
            if string.len(s1) < 10 then
                mw.log(key .. '... ' .. fname .. ' short output\n')
            end
            local s2 = p[fname](frame)
            if s1 ~= s2 then
                mw.log(key .. '... ' .. fname .. ' not pure\n')
            end
        end
    end
end
 
return p

*/